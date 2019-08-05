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

    let messages = [];

    let requestBody = JSON.parse(event.body);
    if (requestBody === null) {
        messages.push("request body is missing");
        callback(null, buildResponse('400', messages));
        return;
    }

    let iso = parseInt(requestBody.iso, 10);

    if (isNaN(iso) || (iso <= 0)) {
        messages.push("ISO must be a positive number.");
    }

    if ((requestBody.filmName !== undefined && typeof requestBody.filmName != 'string') && (requestBody.filmName.length < 1))
    {
        messages.push('\nFilm Name must be a string ("Kodak Tri-X"');
    }

    if ((requestBody.filmCode !== undefined && typeof requestBody.filmCode != 'string') && (requestBody.filmCode.length < 1)){
        messages.push('\nFilm Code must be a string ("TXP")');
    }


    let validationResult = utils.validateFilmType(requestBody.filmType);
    if (!validationResult.isValid) {
        messages.push(`\nFilm Type must be one of: ${JSON.stringify([...validationResult.validFilmTypes])}`);
    }

    validationResult = utils.validateFilmFormat(requestBody.filmFormat);
    if (!validationResult.isValid) {
        messages.push(`\nFilm Format must be one of: ${JSON.stringify([...validationResult.validFilmFormats])}`);
    }

    if (messages.length > 0) {
        callback(null, buildResponse('400', messages));
        return;
    }

    let itemToPut = {};
    itemToPut.primaryHashKey = "FilmStock_" + uuidv1();
    itemToPut.primaryRangeKey = requestBody.filmFormat;
    itemToPut.gsi1HashKey = requestBody.filmName;
    itemToPut.gsi1RangeKey = requestBody.iso;
    itemToPut.data = requestBody;


    let checkForExistingItemParams = {
        TableName: MEDIA_TABLE_NAME,
        IndexName: "GSI_1",
        KeyConditionExpression: "#gsi1HashKey = :filmName",
        ExpressionAttributeNames: {"#gsi1HashKey": "gsi1HashKey"},
        ExpressionAttributeValues: {":filmName": itemToPut.gsi1HashKey}
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
                let existingKey = itemToPut.gsi1HashKey;
                console.log('NOTE: item already exists', existingKey);
                callback(null, buildResponse('409', `A film stock record with name "${existingKey}" already exists.`));
            } else {
                let itemToPutStr = JSON.stringify(itemToPut);
                console.log("writing: ", itemToPutStr);
                dynamodb.put({TableName: MEDIA_TABLE_NAME, Item: itemToPut}, done);
            }
        }
    });
};
