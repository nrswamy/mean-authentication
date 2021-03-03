var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
    return jwt.sign({id:user._id, shortId:user.shortId}, config.secretKeyRet, {
        expiresIn: 36000
    });
};


exports.verify = function (req, res, next) {
   //console.log('verify ret')
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    req.tokenSuccess = false;
    // decode token
    if (token) {
        //console.log(token)
        // verifies secret and checks exp
        jwt.verify(token, config.secretKeyRet, function (err, decoded) {
            if (err) {
                //console.log(err);
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                req.decoded = decoded;
                req.tokenSuccess = true;
                next();  
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};