var express = require('express');
var path = require('path');
var router = express.Router();
var url = require('url');

router.get('/*', function(req, res, next) {
    var filePath = url.parse(req.url).pathname;
    var vendorPath = path.join(__dirname, '..', 'public');
    if(req.params) {
        for(var key in req.params) {
            if(req.params.hasOwnProperty(key)) {
                if(req.params[key]) {
                    vendorPath = path.join(vendorPath, filePath);
                }
            }
        }
    }
    res.sendFile(vendorPath);
});

module.exports = router;
