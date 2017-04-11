class PDFService {
    constructor($window, $q, $http, configEnv) {
        this.config = configEnv;
        this.$q = $q;
        this.$http = $http;
        this.$window = $window;
        this.PDFJS = $window.PDFJS;
    }

    getPDFInfo() {
        const deferred = this.$q.defer();
        let workid = '';
        let searchElements;
        if(this.$window.location.search) {
            searchElements =  this.$window.location.search.match(/workid=([^&]*)/);
            workid = searchElements.length > 1 ? searchElements[1] : '';
        }
        // http://xecm-ot.business.finl.fortis/octs/llisapi.dll?func:ll&objId=113689&objAction=RunReport&workid=11309374
        this
            .$http({
                url: this.config.cgiUrlPrefix,   /*This is empty on purpose because we are pinging current url*/
                params: {
                    func: 'll',
                    objId: this.config.getworkflowattachmentService,
                    objAction: 'RunReport',
                    workid: workid
                }
            })
            .then((response) => {
                const PDFInfo = {
                    viewUrl: '',
                    pages: 0
                };
                //http://xecm-ot.business.finl.fortis/otcs/llisapi.dll/open/11309367
                const document = this.config.cgiUrlPrefix + "/open/" + response.data.DataID;
                PDFInfo.viewUrl = this.config.scriptHome + this.config.pdfjsViewerPath + '?file=' + document;
                this.PDFJS
                    .getDocument(document)
                    .then(function (doc) {
                        PDFInfo.pages = doc.numPages;
                        deferred.resolve(PDFInfo);
                    });
            });

        return deferred.promise;
    }
}
export default {
    PDFService
}
