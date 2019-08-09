const AWS = require('aws-sdk');
const utils = require('../utils');

const MEDIA_TABLE_NAME = process.env.MEDIA_TABLE_NAME;
const buildResponse = utils.buildResponse;

exports.put = (event, context, callback) => {
    console.log('AJM put(): Received event:', JSON.stringify(event));
    console.log('context:', JSON.stringify(context));
    const done = (err, res) => {
        console.log("AJM: in done()", err, res);
        callback(null, buildResponse(
            err ? '400' : '200',
            err ? err.message : JSON.stringify(res)
        ));
    };

    let messages = utils.validateFilmstockRequest(JSON.parse(event.body));
    if (messages.length > 0) {
        callback(null, buildResponse('400', messages));
        return;
    }

    let itemToPost = {};
    itemToPost.primaryHashKey = undefined;
    itemToPost.primaryRangeKey = undefined;
    itemToPost.gsi1HashKey = requestBody.filmName;
    itemToPost.gsi1RangeKey = requestBody.filmFormat;
    itemToPost.data = requestBody;

    console.log("AJM params: ", checkForExistingItemParams);
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    let itemToPutStr = JSON.stringify(itemToPost);
    console.log("writing: ", itemToPutStr);
    dynamodb.put({TableName: MEDIA_TABLE_NAME, Item: itemToPost}, done);
};
