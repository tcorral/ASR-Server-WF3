class UnselectedPagesService {
    constructor($q, OTFormService, PDFService) {
        const service = this;
        service.documents = [];
        service.$q = $q;
        service.OTFormService = OTFormService;
        service.PDFService = PDFService;
        service.isValidRange = true;
        service.pages = 0;

        function init() {
            service.documents = OTFormService.getDocuments();
        }

        init();
    }

    getPDFPages(sync) {
        if(sync) {
            return this.pages;
        } else {
            let promise;
            if(this.pages === 0) {
                promise = this
                            .PDFService
                            .getPDFInfo()
                            .then((PDFInfo) => {
                                this.pages = PDFInfo.pages;
                                return PDFInfo.pages;
                            });
            } else {
                const deferred = this.$q.defer();
                deferred.resolve(this.pages);
                promise = deferred.promise;
            }
            return promise;
        }
    }

    getValidStartRange(pages, value) {
        const unselectedPages = this.getUnselectedPages(pages);
        let fixedValue;
        let numberFixedValue;
        if(!unselectedPages.length) {
            if(value < 1) {
                fixedValue = 1;
            } else if(value > pages) {
                fixedValue = pages;
            }
        } else {
            fixedValue = unselectedPages[0] || 1;
        }
        numberFixedValue = parseInt(fixedValue, 10);
        return isNaN(numberFixedValue) ? 1 : numberFixedValue;
    }

    getValidEndRange(pages, value) {
        const unselectedPages = this.getUnselectedPages(pages);
        let fixedValue;
        let numberFixedValue;
        if(!unselectedPages.length) {
            if(value < 1) {
                fixedValue = 1;
            } else if(value > pages) {
                fixedValue = pages;
            }
        } else {
            if(value < unselectedPages[0] - 1) {
                fixedValue = unselectedPages[0];
            } else if(value > pages) {
                fixedValue = pages;
            } else {
                fixedValue = value;
            }
        }
        numberFixedValue = parseInt(fixedValue, 10);
        return isNaN(numberFixedValue) ? pages : numberFixedValue;
    }

    getDocuments() {
        return this.OTFormService.getDocuments();
    }

    getUnselectedPages(pages) {
        const service = this;
        const namedPages = {};
        const undefinedPages = [];
        let i;

        //identify undefined pages by comparing defined pages with PDF range
        for (i = 0; i < service.documents.length; i++) {
            for (let j = (service.documents[i].rngRange.rangeStart || 1); j <= service.documents[i].rngRange.rangeEnd; j++) {
                namedPages[j] = true;
            }
        }

        for (i = 1; i <= pages; i++) {
            if (!namedPages[i]) {
                undefinedPages.push(i);
            }
        }

        service.isValidRange = undefinedPages.length === 0;

        return undefinedPages;
    }
}

export default UnselectedPagesService;
