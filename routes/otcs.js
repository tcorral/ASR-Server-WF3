var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var url = require('url');

/* GET home page. */
router.get('/llisapi.dll', function(req, res, next) {
    var urlParts = url.parse(req.url, true);
    var query = urlParts.query;
    var jsonMocksPath = path.join(__dirname, '..',  'json-mocks');
    var json = {};
    if(query.func === 'll' && query.objAction === 'RunReport') { 
        if(query.filter && !query.filter2) {
            try{
                json = require(path.join(jsonMocksPath, query.filter + '.json'));
            } catch (er) {
                json = require(path.join(jsonMocksPath, query.objId + '.json'));
            }
        } else if(query.filter2 && query.objId !== "113690") {
            json = require(path.join(jsonMocksPath, query.filter2 + '.json'));
        } else if(query.workid) {
            json = require(path.join(jsonMocksPath, query.workid + '.json'));
        } else {
            json = require(path.join(jsonMocksPath, query.objId + '.json'));
        }
        res.json(json);
    } else {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }
    
});

router.post('/llisapi.dll', function (req, res, next) {
    console.log(req.body);
    res.json({});
});


router.get('/llisapi.dll/open/:documentId', function (req, res, next) {
    var pdf = path.join(__dirname, '..',  'pdf-mocks', 'pdf.pdf');
    var file = fs.createReadStream(pdf);
    var stat = fs.statSync(pdf);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    file.pipe(res);
});
module.exports = router;
