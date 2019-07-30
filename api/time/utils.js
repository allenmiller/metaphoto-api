module.exports= {
    buildResponse: function buildResponse(statusCode, body) {
        return {
            statusCode: statusCode,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
};
