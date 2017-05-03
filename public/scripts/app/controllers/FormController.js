import EventBus from 'krasimir/EventBus';

class FormController {
    constructor(PDFService) {
        const ctrl = this;
        ctrl.PDFService = PDFService;
        ctrl.showDelegateForm = true;
        ctrl.viewerUrl = '';
        ctrl.form = null;
        ctrl.PDFpages = Number.MAX_SAFE_INTEGER;
    }

    $onInit() {
        this.PDFService
            .getPDFInfo()
            .then((PDFInfo) => {
                this.viewerUrl = PDFInfo.viewUrl;
                this.PDFpages = PDFInfo.pages;
            });

        EventBus.addEventListener("delegate-form:sent", () => {
            this.showDelegate = false;
        });
    }
}

export default {
    FormController
};
