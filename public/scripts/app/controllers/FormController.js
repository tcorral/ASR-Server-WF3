class FormController {
    constructor(FormService, PDFService, devConfig) {
        const ctrl = this;

        ctrl.FormService = FormService;
        ctrl.PDFService = PDFService;
        ctrl.viewerUrl = '';
        ctrl.config = devConfig;
        ctrl.form = null;
        ctrl.model = {
            documentranges: [
                {
                    rangefrom: 1,
                    rangeto: Number.MAX_SAFE_INTEGER,
                    documentname: new Date().toISOString().substring(0, 10).replace("-", "").replace("-", "") + " testdocument",
                    followup: true,
                    workflowtype: false,
                    followupdays: 7
                }
            ]
        };
        ctrl.PDFpages = Number.MAX_SAFE_INTEGER;
        ctrl.cachedUndefinedPages = [];

        function init() {
            PDFService
                .getPDFInfo()
                .then(function (PDFInfo) {
                    ctrl.viewerUrl = PDFInfo.viewUrl;
                    ctrl.PDFpages = ctrl.model.documentranges[0].rangeto = PDFInfo.pages;
                });
        }

        init();
    }

    setDocumentRangeTo(page) {
        const model = this.model;
        model.documentranges[model.documentranges.length - 1].rangeto = page;
    }

    getUndefinedPages() {
        const ctrl = this;
        const res = [];
        const res2 = [];
        //identify defined pages
        for (let i = 0; i < ctrl.model.documentranges.length; i++) {
            for (let j = ctrl.model.documentranges[i].rangefrom; j <= ctrl.model.documentranges[i].rangeto; j++) {
                if (res.indexOf(j) === -1) {
                    res.push(j);
                }
            }
        }
        //identify undefined pages by comparing defined pages with PDFrange
        for (let i = 1; i <= ctrl.PDFpages; i++) {
            if (res.indexOf(k) === -1) {
                res2.push(k);
            }
        }
        ctrl.cachedUndefinedPages = res2;
        return res2;
    }

    hasDocumentMorePagesThanLimit () {
        return this.cachedUndefinedPages.length > this.config.pageLimit;
    }

    getRemainingUndefinedPagesOverLimit() {
        return this.cachedUndefinedPages.length - this.config.pageLimit;
    }

    hasDocumentAnyUndefinedPage() {
        return this.getUndefinedPages().length > 0;
    }

    contextIsKenmerk() {
        return this.FormService
                .getContext() === 'kenmerk';
    }

    onSubmit() {
        alert(JSON.stringify(this.model, null, 2));
    }
}

export default {
    FormController
};