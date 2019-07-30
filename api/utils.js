module.exports= {
    buildResponse: function buildResponse(statusCode, body) {
        return {
            statusCode: statusCode,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
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
    }
};
