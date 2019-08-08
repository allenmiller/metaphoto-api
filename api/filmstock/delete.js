const AWS = require('aws-sdk');
const utils = require('../utils');

const MEDIA_TABLE_NAME = process.env.MEDIA_TABLE_NAME;
const buildResponse = utils.buildResponse;

exports.delete = (event, context, callback) => {
    console.log('AJM delete(): Received event:', JSON.stringify(event));
    console.log('context:', JSON.stringify(context));

    const dynamodb = new AWS.DynamoDB.DocumentClient();
    let itemToDelete = event.pathParameters.filmstockId;
    let deleteParams = {
        TableName: MEDIA_TABLE_NAME,
        Key: {
            "primaryHashKey": itemToDelete
        }
    };

    console.log("Deleting item ", deleteParams);
    // TODO: add check to prevent deletion of filmstock item pointed to by film items.
    dynamodb.delete(deleteParams, (err, data) => {
        if (err) {
            console.log("ERROR deleting item: ", err);
            callback(null, buildResponse('500', err));
        } else {
            console.log("AJM: back from delete(): ", data);
            callback(null, buildResponse('200', `item deleted`));
        }
    });
};
