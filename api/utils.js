module.exports = {

    buildResponse: function buildResponse(statusCode, body) {
        let headers = {
//            'Access-Control-Allow-Origin': process.env.WEB_APP_URL,
            'Access-Control-Allow-Origin': "*",
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
        const validFilmTypes = getValidFilmTypes();
        return validFilmTypes.has(filmType)
            ? {isValid: true}
            : {isValid: false, getValidFilmTypes: validFilmTypes};
    },

    validateFilmFormat: function validateFilmFormat(filmFormat) {
        const validFormats = getValidFilmFormats();
        return validFormats.has(filmFormat)
        ? {isValid: true}
        : {isValid: false, getValidFilmFormats: validFormats}
    },

    getValidFilmTypes: function getValidFilmTypes() {
        return new Set([
            "COLOR_NEGATIVE",
            "COLOR_POSITIVE",
            "BLACK_AND_WHITE",
            "COLOR_POLAROID",
            "BLACK_AND_WHITE_POLAROID"
        ]);
    },

    getValidFilmFormats: function getValidFilmFormats() {
        return new Set([
            "35mm",
            "120",
            "116",
            "220",
            "4x5",
            "8x10"
        ]);
    }
};
