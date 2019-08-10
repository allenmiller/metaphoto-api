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

    let requestBody = JSON.parse(event.body);
    let messages = utils.validateFilmstockRequest(requestBody);
    if (messages.length > 0) {
        callback(null, buildResponse('400', messages));
        return;
    }

    let itemToPut = {};
    itemToPut.primaryHashKey = event.pathParameters.filmstockId;
    itemToPut.primaryRangeKey = event.pathParameters.filmFormat;
    itemToPut.gsi1HashKey = requestBody.filmName;
    itemToPut.gsi1RangeKey = requestBody.filmFormat;
    itemToPut.data = requestBody;

    const dynamodb = new AWS.DynamoDB.DocumentClient();
    let itemToPutStr = JSON.stringify(itemToPut);
    console.log("writing: ", itemToPutStr);
    dynamodb.update({TableName: MEDIA_TABLE_NAME, Item: itemToPut}, done);
};
