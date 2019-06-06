const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const validation = require('../utils/validation');

exports.requestValidation = (req, res) => {
    const { address } = req.body;
    if (address) {
        const walletAddress = address;
        validation.getLevelDBData(walletAddress).then((request) => {
            const oldDate = new Date(parseFloat(request.requestTimeStamp)).getTime();
            const newDate = new Date().getTime();
            const timeDifference = (300 - ((newDate - oldDate) / 1000)).toString();
            // within 5 minutes
            if(timeDifference > 0) {
                request.validationWindow = timeDifference;
                validation.addLevelDBData(walletAddress, JSON.stringify(request)).then(() => {
                    res.send(request);
                }).catch((error) => {
                    res.send(error);
                });
            } else {
                request.validationWindow = 300;
                request.requestTimeStamp = new Date().getTime().toString();
                request.message = walletAddress + ":" + request.requestTimeStamp + ":" + "starRegistry";
                validation.addLevelDBData(walletAddress, JSON.stringify(request)).then(() => {
                    res.send(request);
                }).catch((error) => {
                    res.send(error);
                });
            }
        }).catch(() => {
            let request = {};
            request.address = walletAddress;
            request.requestTimeStamp = new Date().getTime().toString();
            request.message = walletAddress + ":" + request.requestTimeStamp + ":" + "starRegistry";
            request.validationWindow = 300;
            validation.addLevelDBData(walletAddress, JSON.stringify(request)).then(() => {
                console.log(JSON.stringify(request));
                res.send(request);
            }).catch((error) => {
                res.send(error);
            });
        });
    } else {
        res.send({"error": "Wallet address is required."});
    }

}

exports.verifySignature = (req, res) => {
    const { address, signature } = req.body;
    if (address && signature) {
        const walletAddress = address;
        const messageSignature = signature;
        validation.getLevelDBData(walletAddress).then((request) => {
            const oldDate = new Date(parseFloat(request.requestTimeStamp)).getTime();
            const newDate = new Date().getTime();
            const timeDifference = (300 - ((newDate - oldDate) / 1000)).toString();
            if(timeDifference > 0) {
                request.validationWindow = timeDifference;
                const message = request.message;
                const isValid = bitcoinMessage.verify(message, walletAddress, messageSignature);
                if(isValid) {
                    const result = {};
                    result.registerStar = isValid;
                    result.status = request;
                    result.status.messageSignature = isValid;
                    res.send(result);
                } else {
                    res.send({"error": "Invalid message Signature"});
                }
            } else {
                res.send({"error": "Time Expired"});
            }
        }).catch(() => {
            res.send({"error": "Request can't be created"});
        });
    } else {
        res.send({"error": "Wallet address and message signature is required."});
    }
};
