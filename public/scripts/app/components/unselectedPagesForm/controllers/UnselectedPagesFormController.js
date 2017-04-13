class UnselectedPagesFormController {
    constructor(PDFService, UnselectedPagesService) {
        const ctrl = this;
        ctrl.PDFService = PDFService;
        ctrl.UnselectedPagesService = UnselectedPagesService;
        ctrl.pages = [];
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

        function init() {
            PDFService
                .getPDFInfo()
                .then(function (PDFInfo) {
                    ctrl.pages = ctrl.documentranges[0].rangeto = PDFInfo.pages;
                });
        }

        init();
    }

    getUnselectedPages() {
        var ctrl = this;
        return (ctrl.unselectedPages = ctrl.UnselectedPagesService.getUnselectedPages(ctrl.pages, ctrl.model.documentranges));
    }
    
    hasMoreUnselectedPagesThanLimit() {
        return this.unselectedPages.length > this.limit;
    }

    hasNoUnselectedPages() {
        return this.unselectedPages.length === 0;
    }
}

export default UnselectedPagesFormController;