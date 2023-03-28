import json
import pandas as pd
import numpy as np
import openpyxl
import boto3
import io
import logging

s3Client = boto3.client('s3')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    #const userid = event.queryStringParameters.id;
    # bucket and file name
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    logger.info(event["queryStringParameters"])

    #reponse1 = s3Client.get_object(Bucket=bucket, Key=key)
    reponse1 = s3Client.get_object(Bucket='ghgwebapptemplatebucketfh3471h93h91c10053-staging', Key='public/S1&2_Example_Data.xlsx')
    reponse2 = s3Client.get_object(Bucket='ghgwebapptemplatebucketfh3471h93h91c10053-staging', Key='public/Emission_Factors.xlsx')

    # getting response body (file data)
    scopeData = reponse1['Body'].read()
    emissionFactors = reponse2['Body'].read()

    # gets file object
    scopeDF  = io.BytesIO(scopeData)
    emissionFactorsDF = io.BytesIO(emissionFactors)

    inventory_data = pd.read_excel(scopeDF, sheet_name=None)
    emission_factors = pd.read_excel(emissionFactorsDF, sheet_name=None)

    # Noor's scope2 code
    purchased_energy = inventory_data.parse('Scope 2 - Purchased Energy')
    for index, row in purchased_energy.iterrows():
        if row['Scope 2'] == 'Facility unique ID':
            break
        purchased_energy.drop([index],inplace=True)
    purchased_energy = purchased_energy.rename(columns=purchased_energy.iloc[0]).drop(purchased_energy.index[0])
    purchased_energy = purchased_energy.set_index(['Purchased energy type', 'Grid Region', 'Facility unique ID', 'Country', 'Year'])

    s2_emission_factors = emission_factors.parse('Purchased Energy')
    s2_emission_factors = s2_emission_factors.set_index(['Type', 'Grid Region'])

    conversions = emission_factors.parse('Conversions')
    conversions = conversions.set_index(['Convert From', 'Convert To'])

    purchased_energy_conversion = pd.merge(purchased_energy, s2_emission_factors['Unit'], left_index=True, right_index=True)
    purchased_energy_conversion = purchased_energy_conversion.set_index(['Unit_x', 'Unit_y'], append=True).rename_axis(index={'Unit_x': 'Convert From', 'Unit_y': 'Convert To'})
    purchased_energy_conversion = pd.merge(purchased_energy_conversion, conversions['Multiply By'],left_index=True,right_index=True, how='left')
    purchased_energy_conversion['Final Fuel Consumption'] = purchased_energy_conversion['Consumption'] * purchased_energy_conversion['Multiply By']

    purchased_energy_final = pd.merge(purchased_energy_conversion, s2_emission_factors,left_index=True,right_index=True, how='left').reset_index(level=['Convert From', 'Convert To'])
    purchased_energy_final.fillna({'CH4 Factor\n(kg/kWh)': 0, 'N2O Factor\n(kg/kWh)': 0}, inplace=True)

    purchased_energy_co2_emissions = purchased_energy_final['Final Fuel Consumption'] * purchased_energy_final['CO2 Factor\n(kg/kWh)']
    purchased_energy_ch4_emissions = purchased_energy_final['Final Fuel Consumption'] * purchased_energy_final['CH4 Factor\n(kg/kWh)']
    purchased_energy_n2o_emissions = purchased_energy_final['Final Fuel Consumption'] * purchased_energy_final['N2O Factor\n(kg/kWh)']
    purchased_energy_total_emissions = purchased_energy_co2_emissions + (purchased_energy_ch4_emissions*28/1000) + (purchased_energy_n2o_emissions*265/1000)
    purchased_energy_summary_emissions = pd.concat([purchased_energy_co2_emissions, purchased_energy_ch4_emissions, purchased_energy_n2o_emissions, purchased_energy_total_emissions], axis=1)
    purchased_energy_summary_emissions.columns = ['kgCO2', 'kgCH4', 'kgN2O', 'kgCO2e']
    print(purchased_energy_summary_emissions)
    
    logger.info(purchased_energy_total_emissions)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps('Hello from your new Amplify Python lambda!')
    }