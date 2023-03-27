import json
import pandas as pd
import numpy as np
import boto3
import io


aws_id = ''
aws_secret = ''

s3Client = boto3.client('s3')

def handler(event, context):
    # bucket and file name
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    reponse1 = s3Client.get_object(Bucket=bucket, Key=key)
    reponse2 = s3Client.get_object(Bucket=bucket, Key='s3://ghgwebapptemplatebucketfh3471h93h91c10053-staging/public/Emission_Factors.xlsx')

    #scopeData = reponse1['Body'].read()
    #emissionFactors = reponse2['Body'].read()

    scopeDF  = pd.read_excel(reponse1)
    emissionFactorsDF = pd.read_excel(reponse2)



    inventory_data = pd.ExcelFile(scopeDF)
    emission_factors = pd.ExcelFile(emissionFactorsDF)
  
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps('Hello from your new Amplify Python lambda!')
    }