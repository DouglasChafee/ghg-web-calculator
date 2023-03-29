import json
import pandas as pd
import numpy as np
import openpyxl
import boto3
import io
import logging
import os
import re # might need to add lambda layer

s3 = boto3.resource('s3')
ddb = boto3.client('dynamodb')
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

    # Get user ID and key from params
    userID = event["queryStringParameters"]["userID"]
    Key = event["queryStringParameters"]["s3FileKey"]
    # creating local files
    local_file_name = '/tmp/userData.xlsx'

    # downloading files from s3 to tmp ephemeral storage
    s3.Bucket('ghgwebapptemplatebucketfh3471h93h91c10053-staging').download_file(Key, local_file_name)
    # s3Client.download_file('ghgwebapptemplatebucketfh3471h93h91c10053-staging', 'public/S1&2_Example_Data.xlsx', local_file_name)

    logger.info("Passed Check Here: " + str(os.path.isfile(local_file_name)))

    # getting excel object




    # Create return dictionary
    errors = ["Error: 1", "Error: 2", "Error: 3"]
    valid = True
    jayson = {'isValid':valid, 'errorList':errors}

    # Return to the request from the api
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(jayson)
    }