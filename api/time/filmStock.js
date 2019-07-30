const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const utils = require('./utils');

const MEDIA_TABLE_NAME = process.env.MEDIA_TABLE_NAME;

const buildResponse = utils.buildResponse;
exports.getAll = (event, context, callback) => {
    console.log('AJM getAll(): Received event:', JSON.stringify(event));
    console.log('context:', JSON.stringify(context));

    const params = {
        TableName: MEDIA_TABLE_NAME
    };

    const dynamodb = new AWS.DynamoDB.DocumentClient();
    console.log("Scanning "+ MEDIA_TABLE_NAME +" table.");
    dynamodb.scan(params, onScan);

    let results = [];
    function onScan(err, data) {
        if (err) {
            let errorMessage = JSON.stringify(err);
            console.error("Unable to scan the table. Error JSON:", errorMessage);
            callback(null, buildResponse('404', err));
        } else {
            console.log("Scan succeeded: ", data);
            data.Items.forEach(function(item) {
                console.log(item);
                results.push(item);
            });

            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                dynamodb.scan(params, onScan);
            }
            console.log(results);
            callback(null, buildResponse('200', results));
        }
    }
};

exports.post = (event, context, callback) => {
    console.log('AJM put(): Received event:', JSON.stringify(event));
    console.log('context:', JSON.stringify(context));
    const done = (err, res) => {
        console.log("AJM: in done()", err, res);
        callback(null, buildResponse(
            err ? '400' : '200',
            err ? err.message : JSON.stringify(res)
        ));
    };

    let message = [];

    let requestBody = JSON.parse(event.body);
    if (requestBody === null) {
        message.push("request body is missing");
        callback(null, buildResponse('400', message));
    }

    if (typeof requestBody.iso != 'number') {
        message.push("ISO must be a number.")
    }

    if (typeof requestBody.filmName != 'string') {
        message.push('Film Name must be a string ("Kodak Tri-X"');
    }

    if (typeof requestBody.filmCode != 'string') {
        message.push('Film Code must be a string ("TXP"');
    }

    const validateFilmType = utils.validateFilmType;
    const validationResult = validateFilmType(requestBody.filmType);
    if (!validationResult.isValid) {
        message.push("Film Type must be one of: " + JSON.stringify(...validationResult.validFilmTypes));
    }

    if (message.length > 0) {
        callback(null, buildResponse('400', message));
    }

    let itemToPut = {};
    itemToPut.primaryHashKey = "FilmSheet_" + uuidv1();
    itemToPut.primaryRangeKey = requestBody.iso.toString();
    itemToPut.gsi1HashKey = requestBody.filmCode;
    itemToPut.data = requestBody;
    let itemToPutStr = JSON.stringify(itemToPut);

    console.log("writing: ", itemToPutStr);

    const dynamodb = new AWS.DynamoDB.DocumentClient();
    dynamodb.put({TableName: MEDIA_TABLE_NAME, Item: itemToPut}, done);
};

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
    let data = {
        "iso": 320,
        "field1": "value1",
        "field2": true
    };

    let recordStr = {
        "primaryKey": "45-str",
        "sortKey": data.iso.toString(),
        "data" : data
    };

    console.log("writing: ", recordStr);
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    dynamodb.update({TableName: MEDIA_TABLE_NAME, Item: recordStr}, done);
    console.log("writing: ", recordObj);

};
