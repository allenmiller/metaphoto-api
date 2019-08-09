const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const utils = require('../utils');

const MEDIA_TABLE_NAME = process.env.MEDIA_TABLE_NAME;
const buildResponse = utils.buildResponse;

exports.post = (event, context, callback) => {
    console.log('AJM post(): Received event:', JSON.stringify(event));
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
    itemToPost.primaryHashKey = "FilmStock_" + uuidv1();
    itemToPost.primaryRangeKey = requestBody.filmFormat;
    itemToPost.gsi1HashKey = requestBody.filmName;
    itemToPost.gsi1RangeKey = requestBody.filmFormat;
    itemToPost.data = requestBody;


    let checkForExistingItemParams = {
        TableName: MEDIA_TABLE_NAME,
        IndexName: "GSI_1",
        KeyConditionExpression: "#gsi1HashKey = :filmName and #gsi1RangeKey = :filmFormat",
        ExpressionAttributeNames: {
            "#gsi1HashKey": "gsi1HashKey",
            "#gsi1RangeKey": "gsi1RangeKey"
        },
        ExpressionAttributeValues: {
            ":filmName": itemToPost.gsi1HashKey,
            ":filmFormat": itemToPost.gsi1RangeKey
        }
    };

    console.log("AJM params: ", checkForExistingItemParams);
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    dynamodb.query(checkForExistingItemParams, (err, data) => {
        if (err) {
            console.log("ERROR checking for existing item: ", err);
            callback(null, buildResponse('500', err));
        } else {
            console.log("AJM: back from get(): ", data);
            if (data && data.Count > 0) {
                let existingFilmName = itemToPost.gsi1HashKey;
                let existingFilmFormat = itemToPost.gsi1RangeKey;
                console.log('NOTE: item already exists', existingFilmName);
                callback(null, buildResponse('409', `A film stock record with name "${existingFilmName}" and format "${existingFilmFormat}"already exists.`));
            } else {
                let itemToPutStr = JSON.stringify(itemToPost);
                console.log("writing: ", itemToPutStr);
                dynamodb.put({TableName: MEDIA_TABLE_NAME, Item: itemToPost}, done);
            }
        }
    });
};
