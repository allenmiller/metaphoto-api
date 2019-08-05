module.exports = {

    buildResponse: function buildResponse(statusCode, body) {
        let headers = {
//            'Access-Control-Allow-Origin': process.env.WEB_APP_URL,
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json'
        };
        let statusText;
        switch (statusCode) {
            case '200': statusText = "Success"; break;
            case '400': statusText = "Invalid request"; break;
            case '404': statusText = "Resource not found"; break;
            case '500': statusText = "Internal server error"; break;
            default: statusText = "";
        }
        return {
            statusCode: statusCode,
            statusText: statusText,
            body: JSON.stringify(body),
            headers: headers
        }
    },

    validateFilmType: function validateFilmType(filmType) {
        const validFilmTypes = new Set([
            "COLOR_NEGATIVE",
            "COLOR_POSITIVE",
            "BLACK_AND_WHITE",
            "COLOR_POLAROID",
            "BLACK_AND_WHITE_POLAROID"
        ]);

        return validFilmTypes.has(filmType)
            ? {isValid: true}
            : {isValid: false, validFilmTypes: validFilmTypes};
    },

    validateFilmFormat: function validateFilmFormat(filmFormat) {
        const validFormats = new Set([
            "35mm",
            "120",
            "116",
            "220",
            "4x5",
            "8x10"
        ]);
        return validFormats.has(filmFormat)
        ? {isValid: true}
        : {isValid: false, validFilmFormats: validFormats}
    },
};
