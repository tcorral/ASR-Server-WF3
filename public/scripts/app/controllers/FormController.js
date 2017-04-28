import EventBus from 'krasimir/EventBus';

class FormController {
    constructor(FormService, PDFService, configEnv, OTFormService) {
        const ctrl = this;
        ctrl.FormService = FormService;
        ctrl.PDFService = PDFService;
        ctrl.showDelegateForm = true;
        ctrl.viewerUrl = '';
        ctrl.config = configEnv;
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
    }

    $onInit() {
        this.PDFService
            .getPDFInfo()
            .then((PDFInfo) => {
                this.viewerUrl = PDFInfo.viewUrl;
                this.PDFpages = this.model.documentranges[0].rangeto = PDFInfo.pages;
            });

        EventBus.addEventListener("delegate-form:sent", () => {
            this.showDelegate = false;
        });
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

    hasDocumentMorePagesThanLimit() {
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

    toggleForms() {
        ctrl.showDelegateForm = !ctrl.showDelegateForm;
    }
}

export default {
    FormController
};
