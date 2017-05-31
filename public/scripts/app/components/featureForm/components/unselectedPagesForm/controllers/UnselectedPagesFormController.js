import EventBus from 'krasimir/EventBus';

class UnselectedPagesFormController {
    constructor(UnselectedPagesService) {
        const ctrl = this;
        ctrl.UnselectedPagesService = UnselectedPagesService;
        ctrl.pages = 0;
        ctrl.minPage = 1;
        ctrl.maxPage = 0;
        ctrl.documents = UnselectedPagesService.getDocuments();
    }

    $onInit() {
        this
            .UnselectedPagesService
            .getPDFPages()
            .then(maxPages => {
                var document = this.documents[0];
                this.maxPage = this.pages = maxPages;
                if(document && !document.rngRange) {
                    document.rngRange = {};
                }
                if (document && (!document.rngRange.rangeStart && !document.rngRange.rangeEnd ) ) {
                    document.rngRange.rangeStart = 1;
                    document.rngRange.rangeEnd = maxPages;
                }
                EventBus.addEventListener('unselected:request', () => {
                    var ranges = this.getRangesFromUndefinedPages(maxPages);
                    EventBus.dispatch('unselected:get', ranges);
                });
            });
    }

    getRangesFromUndefinedPages(pages) {
        return this.UnselectedPagesService.getRangesFromUndefinedPages(pages);
    }

    getUnselectedPages() {
        return this.UnselectedPagesService.getUnselectedPages(this.pages);
    }

    hasMoreUnselectedPagesThanLimit() {
        return this.getUnselectedPages().length > this.limit;
    }

    hasNoUnselectedPages() {
        return this.getUnselectedPages().length === 0;
    }
}

export default UnselectedPagesFormController;