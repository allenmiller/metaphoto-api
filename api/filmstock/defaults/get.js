const utils = require('../../utils');

exports.get = (event, context, callback) => {

    const validFilmFormats = utils.getValidFilmFormats();
    const validFilmTypes = utils.getValidFilmTypes();

    let defaults = {
        filmFormats: validFilmFormats,
        filmTypes: validFilmTypes
    };

    callback(null, utils.buildResponse('200', JSON.stringify(defaults)));
};
