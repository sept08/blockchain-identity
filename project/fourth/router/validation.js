module.exports = function (app) {
    let validationController = require('../controller/validation');

    app.route('/requestValidation')
        .post(validationController.requestValidation);

    app.route('/message-signature/validate')
        .post(validationController.verifySignature)
};
