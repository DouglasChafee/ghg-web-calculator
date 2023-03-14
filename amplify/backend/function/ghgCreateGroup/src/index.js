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
    const groupID = event.queryStringParameters.id;
    const groupName = event.queryStringParameters.name;
    // format data and then put it into body of response
    await createGroup(groupID, groupName).then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify('Create User new group with name: ' + groupName),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }
        }).catch((err) => {
            console.error(err)
        })
    })
};

function createGroup(groupID, groupName) {
    const params = {
        TableName: 'Group-hl3z2eogtjg2to4aktokmtn23y-staging',
        Item: {
            id: groupID,
            name: groupName
        }
    }
    return ddb.put(params).promise();
};
