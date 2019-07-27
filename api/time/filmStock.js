import AWS from 'aws-sdk';


exports.put = (event, context, callback) => {

    const dynamodb = new AWS.DynamoDB();
    console.log('AJM: Received event:', JSON.stringify(event, null, 2));
    console.log('context:', JSON.stringify(context, null, 2));
    const done = (err, res) => {
        console.log("AJM: in done()", err, res);
        callback(null, {
            statusCode: err ? '400' : '200',
            body: err ? err.message : JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    let record = {
        MediaName: "45-abc",
        MediaType: "45-TXP-320",
        Data: {
            Holder: "18",
            DateLoaded: "July1"
        }
    };

    console.log("writing: ", record);
    dynamodb.putItem({TableName: "metaphoto-dev", Item: record}, done);
};
