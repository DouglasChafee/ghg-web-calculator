/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {

    // Check if user is has valid authorization token
    if (event.requestContext.authorizer) {
        console.log(`EVENT: ${JSON.stringify(event.requestContext.authorizer.claims)}`);
    }

    // Query backend and format data, then put it into body of API response
    const userid = event.queryStringParameters.id;
    await readProfile(userid).then((data) => {
        console.log(data)
        
        callback(null, {
            statusCode: 200,
            body: JSON.stringify('Read User Profile Infromation: ' + data.Item.id),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }
        }).catch((err) => {
            console.error(err)
        })
    })
};

// Read & Format DynamoDB User Table Query
function readProfile(userid) {
    const params = {
        TableName: 'User-hl3z2eogtjg2to4aktokmtn23y-staging',
        Key: {
            id: userid,
        }
    }
    return ddb.get(params).promise(); // database get request
};