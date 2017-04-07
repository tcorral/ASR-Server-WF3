var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var url = require('url');

console.log(path.join(__dirname, '..',  'json-mocks', 'openPDFbyWorkID.json'));

/* GET home page. */
router.get('/llisapi.dll', function(req, res, next) {
    var urlParts = url.parse(req.url, true);
    var query = urlParts.query;
    if(query.func === 'll') {
        if(query.objId && query.objAction === 'RunReport') {
            if(query.workid) {
                var json = require(path.join(__dirname, '..',  'json-mocks', 'openPDFbyWorkID', query.workid + '.json'));
                res.json(json);
            }
            if(query.filter) {
                console.log(query.filter);
                var json = require(path.join(__dirname, '..',  'json-mocks', 'autoCompleteGroupWR', query.filter + '.json'));
                res.json(json);
            }
        }
    } else {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }
});

//http://xecm-ot.business.finl.fortis/otcs/llisapi.dll?filter=cog&func=ll&objAction=RunReport&objId=113695


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
