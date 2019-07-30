const utils = require('./utils');
exports.handler = (event, context, callback) => {
    let currentTime = new Date();
    let response = utils.buildResponse("200", '{"data":"' + currentTime.toString() + '"}');
    console.log("AJM: ", response);
    callback(null, response);
};
