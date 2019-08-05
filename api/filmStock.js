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
            return;
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
            callback(null, buildResponse('200', JSON.stringify(results)));
        }
    }
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
};
