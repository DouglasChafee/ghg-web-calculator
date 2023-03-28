import json
import pandas as pd
import numpy as np
import openpyxl
import boto3
import io
import logging
import os

s3 = boto3.resource('s3')
ddb = boto3.client('dynamodb')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Format & Exectue DynamoDB User Table Deletion Statement
def createFacility(
        FacilityID, 
        MobileCombustion, 
        StationaryCombustion, 
        Fugitive, 
        NaturalGas, 
        Electicity, 
        Refrigerants, 
        userID, 
        year):
    TableName='YearResult-hl3z2eogtjg2to4aktokmtn23y-staging'
    uniqueID = userID + str(year) + FacilityID
    Item={
        'id': {
        'S': str(uniqueID)
        },
        'COMBUSTION': {
        'N': str(StationaryCombustion)
        },
        'FUGITIVE': {
        'N': str(Fugitive)
        },
        'MOBILE': {
        'N': str(MobileCombustion)
        },
        'NATURAL_GAS': {
        'N': str(NaturalGas)
        },
        'PURCHASED_ELECTRICITY': {
        'N': str(Electicity)
        },
        'REFRIGERANTS': {
        'N': str(Refrigerants)
        },
        'userID': {
        'S': str(userID)
        },
        'YEAR': {
        'N': str(year)
        }
    }
    return ddb.put_item(TableName=TableName, Item=Item)


def getParsedPage(excel, page):
    # Try to parse of the excel file
    try:
        # Return a successfully parsed page
        return( excel.parse(page) )
    except:
        return
    
def isArrNan(arr):
    return all(isNan(a) for a in arr)

def isNan(val):
    return pd.isnull(val)

def checkFacility(excel):
    pageName = "Facility Info"
    # First get the data of the facility page
    page = getParsedPage(excel, pageName)

    # Transform the page to an array or arrays [[row], ... , [row]]
    data = page.to_numpy()
    
    # Hold an array of facilites
    facilityIDs = []
    facility_count = 0
    # Next parse through and find the location of 'unique facility ID'
    row = -1 # Hold the row index
    # Next find the facility unique ID title
    for i in range(len(data)):
        # If the first row contains the string 'Facility unique ID'
        if(data[i][0] == 'Facility unique ID'):
            row = i
            break

    all_facil_index = -1
    # Using the index of the key, check all future rows until All facilities is found
    for i in range(row+1, len(data)):
        # First check if this is the all facilites row
        if(data[i][0] == 'All facilities'):
            # Set the row and break
            all_facil_index = i
            break
        else:
            # First check if the row is not empty
            if not isArrNan(data[i]):
                # Add to the count
                facility_count+=1
                col = 0
                # Check the validity of the row one column at a time

                # Col A: Unique ID
                id = data[i][col]
                # Check if the id is valid regex
                if(not isNan(id)):
                    # Check if the name is already present in the list
                    if id in facilityIDs:
                        # Send an error
                        pass
                    else:
                        # Add the id to the list of ids
                        facilityIDs.append(id) 
    return facilityIDs

def handler(event, context):
    #const userid = event.queryStringParameters.id;
    # bucket and file name
    logger.info(event)
    # bucket = event['Records'][0]['s3']['bucket']['name']
    # key = event['Records'][0]['s3']['object']['key']
    logger.info(event["queryStringParameters"])

    userID = event["queryStringParameters"]["userID"]
    Key = event["queryStringParameters"]["s3FileKey"]
    # creating local files
    local_file_name = '/tmp/userData.xlsx'

    # downloading files from s3 to tmp ephemeral storage
    s3.Bucket('ghgwebapptemplatebucketfh3471h93h91c10053-staging').download_file(Key, local_file_name)
    s3.Bucket('ghgwebapptemplatebucketfh3471h93h91c10053-staging').download_file('public/Emission_Factors.xlsx', '/tmp/emissionFactors.xlsx')
    # s3Client.download_file('ghgwebapptemplatebucketfh3471h93h91c10053-staging', 'public/S1&2_Example_Data.xlsx', local_file_name)

    logger.info("Passed Chcek Here: " + str(os.path.isfile(local_file_name)))
    logger.info("Passed Chcek Here: " + str(os.path.isfile('/tmp/emissionFactors.xlsx')))

    # getting excel object
    inventory_data = pd.ExcelFile('/tmp/userData.xlsx')
    emission_factors = pd.ExcelFile('/tmp/emissionFactors.xlsx')
    
    # logger.info(reponse2)
    logger.info(inventory_data)

    FacilityIDs = checkFacility(inventory_data)

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
    
    mobile_comb = mobile_combustion_total_emissions.index.to_list()
    mobile_last_col = mobile_combustion_total_emissions.to_list()
    year_col = mobile_combustion_summary_emissions.index[0]
    year = year_col[4]

    mobile_dict = {}
    for f in FacilityIDs:
        mobile_dict[f] = 0
        for i in range(len(mobile_comb)):
            if f in mobile_comb[i]:
                if not isNan(mobile_last_col[i]):
                    mobile_dict.update({f : mobile_dict[f]+mobile_last_col[i]})


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
   
    stationary_comb = stationary_combustion_total_emissions.index.to_list()
    stationary_last_col = stationary_combustion_total_emissions.to_list()

    stationary_dict = {}
    for f in FacilityIDs:
        stationary_dict[f] = 0
        for i in range(len(stationary_comb)):
            if f in stationary_comb[i]:
                if not isNan(stationary_last_col[i]):
                    stationary_dict.update({f : stationary_dict[f]+stationary_last_col[i]})


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
    
    fugitive_comb = fugitive_summary_emissions.index.to_list()
    fugitive_last_col = fugitive_summary_emissions.to_list()

    fugitive_dict = {}
    for f in FacilityIDs:
        fugitive_dict[f] = 0
        for i in range(len(fugitive_comb)):
            if f in fugitive_comb[i]:
                if not isNan(fugitive_last_col[i]):
                    fugitive_dict.update({f : fugitive_dict[f]+fugitive_last_col[i]})


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


    purchased_energy_comb = purchased_energy_total_emissions.index.to_list()
    purchased_energy_last_col = purchased_energy_total_emissions.to_list()

    purchased_electricity_dict = {}
    purchased_gas_dict = {}
    purchased_water_dict = {}
    for f in FacilityIDs:
        purchased_electricity_dict[f] = 0
        purchased_gas_dict[f] = 0
        purchased_water_dict[f] = 0
        for i in range(len(purchased_energy_comb)):
            if f in purchased_energy_comb[i]:
                if not isNan(purchased_energy_last_col[i]):
                    if "Electricity" in purchased_energy_summary_emissions.index[i][2]:
                            purchased_electricity_dict.update({f : purchased_electricity_dict[f]+purchased_energy_last_col[i]})
                    elif "heat" in purchased_energy_summary_emissions.index[i][2]:
                            purchased_gas_dict.update({f : purchased_gas_dict[f]+purchased_energy_last_col[i]})
                    elif "water" in purchased_energy_summary_emissions.index[i][2]:
                            purchased_water_dict.update({f : purchased_water_dict[f]+purchased_energy_last_col[i]})

    # Insert facility data in database one at a time
    for id in FacilityIDs:
        logger.info("Processing Facility " + str(id))
        createFacility(
        id,
        mobile_dict[id],
        stationary_dict[id],
        fugitive_dict[id],
        purchased_gas_dict[id],
        purchased_electricity_dict[id],
        purchased_water_dict[id],
        userID,
        int(year)
        )
        logger.info("Finished Inserting Facility " + str(id))


    # remove tmp file here before returning

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps('Calculation Submission was Successful')
    }