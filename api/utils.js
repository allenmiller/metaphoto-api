module.exports = {

    buildResponse: buildResponse = (statusCode, body) => {
        let headers = {
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

    validateFilmType:  validateFilmType = (filmType) => {
        const validFilmTypes = getValidFilmTypes();
        return validFilmTypes.has(filmType)
            ? {isValid: true}
            : {isValid: false, getValidFilmTypes: validFilmTypes};
    },

    validateFilmFormat:  validateFilmFormat = (filmFormat) => {
        const validFormats = getValidFilmFormats();
        return validFormats.has(filmFormat)
        ? {isValid: true}
        : {isValid: false, getValidFilmFormats: validFormats}
    },

    getValidFilmTypes: getValidFilmTypes = () => {
        return new Set([
            "BLACK_AND_WHITE",
            "COLOR_POSITIVE",
            "COLOR_NEGATIVE",
            "COLOR_POLAROID",
            "BLACK_AND_WHITE_POLAROID"
        ]);
    },

    getValidFilmFormats: getValidFilmFormats = () => {
        return new Set([
            "4x5",
            "8x10",
            "35mm",
            "120",
            "116",
            "220"
        ]);
    }
};
