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
    const userid = event.queryStringParameters.id;
    await deleteProfile(userid).then((err) => {
        if (err) {
            console.log(err)
        }
    })
    await deleteCognitoProfile(userid).then((err) => {
        if (err) {
            console.log(err)
        }
    })

    // format response and body of API response
    callback(null, {
        statusCode: 200,
        body: JSON.stringify("Account Deletion was Successful"),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    }).catch((err) => {
        console.error(err)
    })
};

// Format & Exectue DynamoDB User Table Deletion Statement
function deleteProfile(userid) {
    const params = {
        TableName: 'User-hl3z2eogtjg2to4aktokmtn23y-staging',
        Key: {
            id: userid,
        }
    }
    return ddb.delete(params).promise();
};

// Format & Exectue Cognito User Pool Deletion Statement
function deleteCognitoProfile(userid) {
    const params = {
        UserPoolId: 'us-east-2_SFk23qRNG',
        Username: userid
    }
    return cognito.adminDeleteUser(params).promise();
};