module.exports= {
    buildResponse: function buildResponse(statusCode, body) {
        return {
            statusCode: statusCode,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
};
