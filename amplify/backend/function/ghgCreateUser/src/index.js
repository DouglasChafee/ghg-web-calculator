/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();

exports.handler = async (event, context, callback) => {

    if (event.request.userAttributes.sub) {
        try {
            await createUser(event)
            console.log("Success")
        } 
        catch(err) {
            console.log("Error: ", err)
        }
        context.done(null, event)
    }
    else {
        context.log("Error: Nothing was written to DynamoDB")
        context.done(null, event)
    }   
};

function createUser(event) {
    const params = {
        TableName: 'User-hl3z2eogtjg2to4aktokmtn23y-staging',
        Item: {
            'id': {S: event.request.userAttributes.sub},
            'email': {S: event.request.userAttributes.email},
        }
    }
    return ddb.putItem(params).promise();
};
