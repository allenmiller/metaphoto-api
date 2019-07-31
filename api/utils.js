module.exports = {
    WEB_APP_URL: process.env.WEB_APP_URL,

    buildResponse: function buildResponse(statusCode, body) {
        let headers = {
            'Access-Control-Allow-Origin': this.WEB_APP_URL,
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json'
        };
        return {
            statusCode: statusCode,
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
