const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const MEDIA_TABLE_NAME = process.env.MEDIA_TABLE_NAME;

exports.getAll = (event, context, callback) => {
    console.log('AJM getAll(): Received event:', JSON.stringify(event, null, 2));
    console.log('context:', JSON.stringify(context, null, 2));

    const params = {
        TableName: MEDIA_TABLE_NAME
    };

    console.log("Scanning Movies table.");
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
            console.log("Scan succeeded.");
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
            'Content-Type' : 'applicaiton/json'
        }
    })
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

    let record = {
        "mediaId": "45-def",
        "mediaType": "45-TXT-400",
        "data": {
            iso: 320,
            field1: "field1",
            field2: true
        }
    };

    console.log("writing: ", record);
    dynamodb.putItem({TableName: MEDIA_TABLE_NAME, Item: record}, done);
};
