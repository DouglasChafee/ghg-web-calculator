/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    if (event.requestContext.authorizer) {
        console.log(`EVENT: ${JSON.stringify(event.requestContext.authorizer.claims)}`);
    }

    // 2. query backend and format data, then put it into body of response
    const userid = event.queryStringParameters.id;
    // format data and then put it into body of response
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

function readProfile(userid) {
    const params = {
        TableName: 'User-hl3z2eogtjg2to4aktokmtn23y-staging',
        Key: {
            id: userid,
        }
    }
    return ddb.get(params).promise();
};