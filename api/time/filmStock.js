const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuidv5 = require('uuid/v5');

const MEDIA_TABLE_NAME = process.env.MEDIA_TABLE_NAME;

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
            callback(null, {
                statusCode: 404,
                body: Json.stringify("No items found"),
                headers: {
                    'Content-Type' : 'application/json'
                }
            })
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
    callback(null, {
        statusCode: 200,
        body: results,
        headers: {
            'Content-Type' : 'application/json'
        }
    })
};

exports.post = (event, context, callback) => {
    console.log('AJM put(): Received event:', JSON.stringify(event, null, 2));
    console.log('context:', JSON.stringify(context, null, 2));
    const done = (err, res) => {
        console.log("AJM: in done()", err, res);
        callback(null, {
            statusCode: err ? '400' : '200',
            body: err ? err.message : JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    let primaryKey = "FilmSheet_" + uuidv5("sheetname", "metaphoto.ajmiller.net");
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
        callback(null, {
            statusCode: err ? '400' : '200',
            body: err ? err.message : JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json'
            }
        });
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
