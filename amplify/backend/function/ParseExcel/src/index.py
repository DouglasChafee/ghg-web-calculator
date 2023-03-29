import json
import pandas as pd
import numpy as np
import openpyxl
import boto3
import io
import logging
import os
import re # might need to add lambda layer

s3Client = boto3.resource('s3')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):

    # bucket and file name
    logger.info(event)
    # bucket = event['Records'][0]['s3']['bucket']['name']
    # key = event['Records'][0]['s3']['object']['key']

    # this is the query string parameters u pass into the api call on the js calculator page, 
    # u can use a query string parameter with to pass the 'public/S1&2_Example_Data.xlsx' used below to grab the file just make sure ur parameters for the /ParseExcel path are set up in API Gatway correctly
    logger.info(event["queryStringParameters"])

    # creating local files
    local_file_name = '/tmp/userData.xlsx'

    # downloading files from s3 to tmp ephemeral storage
    s3Client.Bucket('ghgwebapptemplatebucketfh3471h93h91c10053-staging').download_file('public/S1&2_Example_Data.xlsx', local_file_name)

    logger.info("Is " + local_file_name +  "Here Check: " + str(os.path.isfile(local_file_name)))

    # getting excel object
    inventory_data = pd.ExcelFile('/tmp/userData.xlsx')  
    logger.info(inventory_data)

    # YOUR CODE WILL GO HERE MOST LIKELY
   
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps('WEEWOOWEEWOO Chad alert!')
    }