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
            json = require(path.join(jsonMocksPath, query.filter + '.json'));
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
    //otcs/llisapi.dll?func=ll&inputLabel1=Complex&inputLabel2=Eigendom+%26+Kadastraal&inputLabel3=104707&objAction=RunReport&objId=11200712 
    
    // if(query.func === 'll') {
    //     if(query.objId && query.objAction === 'RunReport') {
    //         if(query.workid) {
    //             var json = require(path.join(__dirname, '..',  'json-mocks', 'openPDFbyWorkID', query.workid + '.json'));
    //             res.json(json);
    //         }
    //         if(query.filter) {
    //             if(!query.filter2) {
    //                 switch(query.objId) {
    //                     case "113694":
    //                         var json = require(path.join(__dirname, '..',  'json-mocks', 'autoCompleteUserWR', query.filter + '.json'));
    //                         res.json(json);
    //                         break;
    //                     case "113695":
    //                         var json = require(path.join(__dirname, '..',  'json-mocks', 'autoCompleteGroupWR', query.filter + '.json'));
    //                         res.json(json);
    //                         break;
    //                     case "113693":
    //                         var json = require(path.join(__dirname, '..',  'json-mocks', 'documentTypeGroup', query.filter + '.json'));
    //                         res.json(json);
    //                         break;
    //                 }
    //             } else if(query.objId === '7334381'){
    //                 var json = require(path.join(__dirname, '..',  'json-mocks', 'autoCompleteBusinessWorkspace', query.objId + '.json'));
    //                 res.json(json);
    //             } else if(query.objId === "113690") {
    //                 var json = require(path.join(__dirname, '..',  'json-mocks', 'documentTypes', query.objId + '.json'));
    //                 res.json(json);
    //             }
                
    //         } else if(query.objId && !query.Type && !query.inputLabel3) {
    //             if(query.objId === "11199569") {
    //                 var json = require(path.join(__dirname, '..',  'json-mocks', 'exclusionPatterns', query.objId + '.json'));
    //                 res.json(json);
    //             } else if(query.objId !== '11199172') {
    //                 var json = require(path.join(__dirname, '..',  'json-mocks', 'workspaceCategories', query.objId + '.json'));
    //                 res.json(json);
    //             } else {
    //                 var json = require(path.join(__dirname, '..',  'json-mocks', 'subfolders', query.objId + '.json'));
    //                 res.json(json);
    //             }
    //         } else if(query.objId === "14520258" && query.Type === 'BW' && query.ID) {
    //             var json = require(path.join(__dirname, '..',  'json-mocks', 'autoCompleteBusinessWorkspace', query.objId + '.json'));
    //             res.json(json);
    //         } else if(query.objId === "14473737" || query.objId === "11200712" && query.inputLabel3) {
    //             var json = require(path.join(__dirname, '..',  'json-mocks', 'subfolderOptions', query.objId + '.json'));
    //             res.json(json);
    //         }
    //         //http://localhost/otcs/llisapi.dll?func=ll&objId=113694&objAction=RunReport&filter=%252%25
    //     }
    // } else {
    //     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    // }
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
