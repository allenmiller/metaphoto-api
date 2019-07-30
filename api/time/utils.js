module.exports= {
    buildResponse: function buildResponse(statusCode, message) {
        return {
            statusCode: statusCode,
            body: '{message: "' + message + '"}',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
};
