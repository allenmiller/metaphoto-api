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

    validateFilmstockRequest: validateFilmstockRequest = (requestBody) => {
        let messages = [];
        if (requestBody === null) {
            messages.push("request body is missing");
            return messages;
        }

        let iso = parseInt(requestBody.iso, 10);

        if (isNaN(iso) || (iso <= 0)) {
            messages.push("ISO must be a positive number.");
        }

        if ((requestBody.filmName !== undefined && typeof requestBody.filmName != 'string') && (requestBody.filmName.length < 1))
        {
            messages.push('\nFilm Name must be a string ("Kodak Tri-X"');
        }

        if ((requestBody.filmCode !== undefined && typeof requestBody.filmCode != 'string') && (requestBody.filmCode.length < 1)){
            messages.push('\nFilm Code must be a string ("TXP")');
        }


        let validationResult = utils.validateFilmType(requestBody.filmType);
        if (!validationResult.isValid) {
            messages.push(`\nFilm Type must be one of: ${JSON.stringify([...validationResult.getValidFilmTypes])}`);
        }

        validationResult = utils.validateFilmFormat(requestBody.filmFormat);
        if (!validationResult.isValid) {
            messages.push(`\nFilm Format must be one of: ${JSON.stringify([...validationResult.getValidFilmFormats])}`);
        }
        return messages;
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
