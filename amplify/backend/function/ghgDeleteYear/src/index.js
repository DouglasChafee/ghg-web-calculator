/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
*/
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context, callback) => {

    // Check if user is has valid authorization token
    if (event.requestContext.authorizer) {
        console.log(`EVENT: ${JSON.stringify(event.requestContext.authorizer.claims)}`);
    }

    // Execute Deletion statment  delete user in DynamoDB
    const yearids = event.queryStringParameters.id;
    for(let i = 0; i < yearids.length; i++){
        await deleteYear(yearids).then((err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    // format response and body of API response
    callback(null, {
        statusCode: 200,
        body: JSON.stringify("Selected Years were Deleted Successfully"),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    }).catch((err) => {
        console.error(err)
    })
};

// Format & Exectue DynamoDB User Table Deletion Statement
function deleteYear(yearid) {
    const params = {
        TableName: 'YearResult-hl3z2eogtjg2to4aktokmtn23y-staging',
        Key: {
            id: yearid,
        }
    }
    return ddb.delete(params).promise();
};