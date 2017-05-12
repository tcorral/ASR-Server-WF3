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
                const documents = this.documents;
                this.maxPage = this.pages = maxPages;
            })
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