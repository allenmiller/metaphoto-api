exports.handler = (event, context, callback) => {
    let currentTime = new Date();
    let response = {
        statusCode: '200',
        body: '{"data": "The time is: ' + currentTime.toString() + '"}',
        headers: {
            'Access-Control-Allow-Origin': 'https://metaphoto.ajmiller.net',
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json'
        }
    };
    callback(null, response);
};
