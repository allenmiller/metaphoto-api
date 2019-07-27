let AWS = require('aws-sdk');

exports.put = (event, context, callback) => {

    console.log("AJM: in put(), event: ", event);
    console.log("AJM: context", context);
    const dynamodb = new AWS.DynamoDB();
    console.log('AJM: Received event:', JSON.stringify(event, null, 2));
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
        "mediaId": "45-abc",
        "mediaType": "45-TXP-320",
        "data": "data"
    };

    console.log("writing: ", record);
    dynamodb.putItem({TableName: "metaphoto-dev", Item: record}, done);
};
