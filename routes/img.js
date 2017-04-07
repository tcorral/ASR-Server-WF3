var express = require('express');
var path = require('path');
var router = express.Router();
var url = require('url');

/* GET home page. */
router.get('/ASRFormKenmerken/vendor/:res1/:res2/:res3?/:res4?/:res5?/:res6?', function(req, res, next) {
    var vendorPath = path.join(__dirname, '../public/vendor');
    if(req.params) {
        for(var key in req.params) {
            if(req.params.hasOwnProperty(key)) {
                if(req.params[key]) {
                    vendorPath += '/'+ req.params[key];
                }
            }
        }
    }
    res.sendFile(vendorPath);
});

module.exports = router;