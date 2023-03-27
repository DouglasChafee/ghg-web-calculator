import json
import pandas as pd
import numpy as np
import boto3
import io

s3Client = boto3.client('s3')

def handler(event, context):

    # bucket and file name
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    reponse1 = s3Client.get_object(Bucket=bucket, Key=key)
    reponse2 = s3Client.get_object(Bucket=bucket, Key='s3://ghgwebapptemplatebucketfh3471h93h91c10053-staging/public/Emission_Factors.xlsx')

    # getting response body (file data)
    scopeData = reponse1['Body'].read()
    emissionFactors = reponse2['Body'].read()

    # gets file object
    scopeDF  = io.BytesIO(scopeData)
    emissionFactorsDF = io.BytesIO(emissionFactors)

    inventory_data = pd.read_excel(scopeDF)
    emission_factors = pd.read_excel(emissionFactorsDF)
  
    # Noor's mobile code
    mobile_combustion = inventory_data.parse('Scope 1 - Mobile')
    for index, row in mobile_combustion.iterrows():
        if row['Scope 1'] == 'Facility unique ID':
            break
        mobile_combustion.drop([index],inplace=True)
    mobile_combustion = mobile_combustion.rename(columns=mobile_combustion.iloc[0]).drop(mobile_combustion.index[0])
    mobile_combustion = mobile_combustion.set_index(['Data Type', 'Fuel Type', 'Vehicle Type', 'Facility unique ID', 'Country', 'Year'])
    mobile_combustion.fillna({'Fuel Consumption': 0, 'Distance Travelled': 0}, inplace=True)

    s1_mc_emission_factors = emission_factors.parse('Mobile Combustion')
    s1_mc_emission_factors = s1_mc_emission_factors.set_index(['Fuel Type', 'Vehicle Type'])

    conversions = emission_factors.parse('Conversions')
    conversions = conversions.set_index(['Convert From', 'Convert To'])

    mobile_combustion_conversion = pd.merge(mobile_combustion, s1_mc_emission_factors[['Unit', 'MPG Units']], left_index=True, right_index=True)
    mobile_combustion_conversion = mobile_combustion_conversion.set_index(['Fuel Unit', 'Unit'], append=True).rename_axis(index={'Fuel Unit': 'Convert From', 'Unit': 'Convert To'})
    mobile_combustion_conversion = pd.merge(mobile_combustion_conversion, conversions['Multiply By'],left_index=True,right_index=True, how='left')

    units = {'mile': 1, 'km': 1.60934, 'nautical mile': 0.868976}

    mobile_combustion_conversion = mobile_combustion_conversion.reset_index(level=['Data Type'])
    mobile_combustion_conversion['Fuel - Distance Activity'] = mobile_combustion_conversion['Distance Unit'].str.lower().map(units)
    mobile_combustion_conversion['Multiply By'] = np.where(mobile_combustion_conversion['Data Type'] == 'Fuel Use', mobile_combustion_conversion['Multiply By'], mobile_combustion_conversion['Fuel - Distance Activity'])

    mobile_combustion_conversion['Final Fuel Consumption'] = np.where(mobile_combustion_conversion['Data Type'] == 'Fuel Use', mobile_combustion_conversion['Fuel Consumption'] * mobile_combustion_conversion['Multiply By'], mobile_combustion_conversion['Distance Travelled'] * mobile_combustion_conversion['Multiply By'] / mobile_combustion_conversion['Fuel Efficiency'])

    mobile_combustion_final = pd.merge(mobile_combustion_conversion, s1_mc_emission_factors,left_index=True,right_index=True, how='left').reset_index(level=['Convert From', 'Convert To']).set_index(['Data Type'], append = True)

    mobile_combustion_co2_emissions = mobile_combustion_final['Final Fuel Consumption'] * mobile_combustion_final['CO2 Factor\n(kg / unit)']
    mobile_combustion_ch4_emissions = mobile_combustion_final['Final Fuel Consumption'] * mobile_combustion_final['CH4 Factor\n(kg / unit)']
    mobile_combustion_n2o_emissions = mobile_combustion_final['Final Fuel Consumption'] * mobile_combustion_final['N2O Factor\n(kg / unit)']
    mobile_combustion_total_emissions = mobile_combustion_co2_emissions + (mobile_combustion_ch4_emissions*28) + (mobile_combustion_n2o_emissions*265)
    mobile_combustion_summary_emissions = pd.concat([mobile_combustion_co2_emissions, mobile_combustion_ch4_emissions, mobile_combustion_n2o_emissions, mobile_combustion_total_emissions], axis=1)
    mobile_combustion_summary_emissions.columns = ['kgCO2', 'kgCH4', 'kgN2O', 'kgCO2e']

    # Noor's stationary code
    stationary_combustion = inventory_data.parse('Scope 1 - Stationary')
    for index, row in stationary_combustion.iterrows():
        if row['Scope 1'] == 'Facility unique ID':
            break
        stationary_combustion.drop([index],inplace=True)
    stationary_combustion = stationary_combustion.rename(columns=stationary_combustion.iloc[0]).drop(stationary_combustion.index[0])
    stationary_combustion = stationary_combustion.set_index(['Fuel Type', 'Facility unique ID', 'Country', 'Year'])

    s1_emission_factors = emission_factors.parse('Stationary Combustion')
    s1_emission_factors = s1_emission_factors.set_index('Fuel Type')

    conversions = emission_factors.parse('Conversions')
    conversions = conversions.set_index(['Convert From', 'Convert To'])

    stationary_combustion_conversion = pd.merge(stationary_combustion, s1_emission_factors['Unit'], left_index=True, right_index=True)
    stationary_combustion_conversion = stationary_combustion_conversion.set_index(['Unit_x', 'Unit_y'], append=True).rename_axis(index={'Unit_x': 'Convert From', 'Unit_y': 'Convert To'})
    stationary_combustion_conversion = pd.merge(stationary_combustion_conversion, conversions['Multiply By'],left_index=True,right_index=True, how='left')
    stationary_combustion_conversion['Multiply By'].fillna(0, inplace=True)
    stationary_combustion_conversion['Final Fuel Consumption'] = stationary_combustion_conversion['Fuel Consumption'] * stationary_combustion_conversion['Multiply By']

    stationary_combustion_final = pd.merge(stationary_combustion_conversion, s1_emission_factors, left_index=True, right_index=True, how='left').reset_index(level=['Convert From', 'Convert To'])

    stationary_combustion_co2_emissions = stationary_combustion_final['Final Fuel Consumption'] * stationary_combustion_final['CO2 Factor (kg CO2 per mmBtu)']
    stationary_combustion_ch4_emissions = stationary_combustion_final['Final Fuel Consumption'] * stationary_combustion_final['CH4 Factor (g CH4 per mmBtu)']
    stationary_combustion_n2o_emissions = stationary_combustion_final['Final Fuel Consumption'] * stationary_combustion_final['N2O Factor (g N2O per mmBtu)']
    stationary_combustion_total_emissions = stationary_combustion_co2_emissions + (stationary_combustion_ch4_emissions*28/1000) + (stationary_combustion_n2o_emissions*265/1000)
    stationary_combustion_summary_emissions = pd.concat([stationary_combustion_co2_emissions, stationary_combustion_ch4_emissions, stationary_combustion_n2o_emissions, stationary_combustion_total_emissions], axis=1)
    stationary_combustion_summary_emissions.columns = ['kgCO2', 'kgCH4', 'kgN2O', 'kgCO2e']
    print(stationary_combustion_summary_emissions)

    # Noor's fugitive code
    fugitive = inventory_data.parse('Scope 1 - Fugitives')
    for index, row in fugitive.iterrows():
        if row['Scope 1'] == 'Facility unique ID':
            break
        fugitive.drop([index],inplace=True)
    fugitive = fugitive.rename(columns=fugitive.iloc[0]).drop(fugitive.index[0])
    fugitive = fugitive.set_index(['Refrigerant Type', 'Facility unique ID', 'Country', 'Year'])

    s1_f_emission_factors = emission_factors.parse('Fugitives')
    s1_f_emission_factors = s1_f_emission_factors.set_index('Refrigerant Type')

    units = {'lb': 1/2.2, 'metric ton': 1000, 'long ton': 1016, 'short ton': 907, 'kg': 1, 'kilograms': 1}

    fugitive['Quantity Serviced:'] *= fugitive['Unit of Quantity Serviced (dropdown list):'].str.lower().map(units)
    fugitive['Unit of Quantity Serviced (dropdown list):'] = 'Kilograms'

    fugitive['Quantity Recycled:'] *= fugitive['Unit of Quantity Recycled (dropdown list):'].str.lower().map(units)
    fugitive['Unit of Quantity Recycled (dropdown list):'] = 'Kilograms'

    fugitive['Quantity Recycled:'].fillna(0, inplace=True)

    fugitive['Final Quantity'] = fugitive['Quantity Serviced:'] - fugitive['Quantity Recycled:']

    fugitive_summary_emissions = fugitive['Final Quantity'].mul(s1_f_emission_factors['AR5 (kgCO2e)'])
    fugitive_summary_emissions.columns = ['kgCO2e']
    print(fugitive_summary_emissions)

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

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps('Hello from your new Amplify Python lambda!')
    }