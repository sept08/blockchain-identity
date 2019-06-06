module.exports = function (app) {
    let blockController = require('../controller/block');

    app.route('/block')
        .post(blockController.createBlock);

    app.route('/block/:blockId')
        .get(blockController.blockDetails);
};
