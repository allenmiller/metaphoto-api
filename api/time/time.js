exports.handler = (event, context, callback) => {
    let currentTime = new Date();
    let response = {
        statusCode: '200',
        body: '{"data":"' + currentTime.toString() + '"}',
        headers: {
            'Access-Control-Allow-Origin': 'https://metaphoto.ajmiller.net',
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json'
        }
    };
    console.log("AJM: ", response);
    callback(null, response);
};
