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
    }
};
