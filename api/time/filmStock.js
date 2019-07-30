const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuidv1 = require('uuid/v1');
const utils = require('./utils');

const MEDIA_TABLE_NAME = process.env.MEDIA_TABLE_NAME;

const buildResponse = utils.buildResponse;
exports.getAll = (event, context, callback) => {
    console.log('AJM getAll(): Received event:', JSON.stringify(event, null, 2));
    console.log('context:', JSON.stringify(context, null, 2));

    const params = {
        TableName: MEDIA_TABLE_NAME
    };

    console.log("Scanning "+ MEDIA_TABLE_NAME +" table.");
    dynamodb.scan(params, onScan);

    let results = [];
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, buildResponse('404', 'No items found'));
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
        }
    }
    console.log(results);
    callback(null, buildResponse('200', results));
};

exports.post = (event, context, callback) => {
    console.log('AJM put(): Received event:', JSON.stringify(event, null, 2));
    console.log('context:', JSON.stringify(context, null, 2));
    const done = (err, res) => {
        console.log("AJM: in done()", err, res);
        callback(null, buildResponse(
            err ? '400' : '200',
            err ? err.message : JSON.stringify(res)
        ));
    };

    let message = [];

    let body = JSON.parse(event.body);
    if (body === null) {
        message.push("request body is mussing");
        callback(null, buildResponse('400', message));
    }

    console.log(typeof body);
    console.log(typeof body.ISO);
    console.log(typeof body.xyz);
    console.log(typeof body.filmName);
    console.log(typeof body.filmname);

    message.push(typeof body.ISO);
    let iso = body.ISO;
    message.push(typeof iso);
    if (typeof iso != 'number') {
        message.push("ISO must be a number.")
    }

    if (typeof body.filmName != 'string') {
        message.push('filmName must be a string ("Kodak Tri-X"');
    }

    if (typeof body.filmCode != 'string') {
        message.push('filmCode must be a string ("TXP"');
    }

    if (message.length > 0) {
        callback(null, buildResponse('400', message));
    }
    let primaryKey = "FilmSheet_" + uuidv1();
    let data = {
        "iso": 320,
        "field1": "value1",
        "field2": true
    };

    let payloadStr = JSON.stringify(data);
    let recordStr = {
        "primaryKey": primaryKey,
        "sortKey": "45-TXT-400",
        "data" : payloadStr
    };

    console.log("writing: ", recordStr);
    dynamodb.put({TableName: MEDIA_TABLE_NAME, Item: recordStr}, done);
};

exports.put = (event, context, callback) => {
    console.log('AJM put(): Received event:', JSON.stringify(event, null, 2));
    console.log('context:', JSON.stringify(context, null, 2));
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

    let payloadStr = JSON.stringify(data);
    let recordStr = {
        "primaryKey": "45-str",
        "sortKey": "45-TXT-400",
        "data" : payloadStr
    };

    let recordObj = {
        "primaryKey": "45-obj",
        "sortKey": "45-TXT-400",
        "data" : data
    };

    console.log("writing: ", recordStr);
    dynamodb.update({TableName: MEDIA_TABLE_NAME, Item: recordStr}, done);
    console.log("writing: ", recordObj);
    dynamodb.update({TableName: MEDIA_TABLE_NAME, Item: recordObj}, done);

};
