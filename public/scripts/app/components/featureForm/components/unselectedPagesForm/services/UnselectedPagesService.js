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

    getRangesFromDocuments(pages, index) {
        index = typeof index === 'number' ? index : -1;
        const documents = this.OTFormService.getDocuments();
        let lastPage;
        let currentRange = [];
        let usedPages = [];
        const repeatedValues = {};
        const possibleRanges = [];

        documents.forEach(function (document, _index) {
            if(!document.rngRange) {
                document.rngRange = {};
            }
            const start = document.rngRange.rangeStart;
            const end = document.rngRange.rangeEnd;
            for(let page = start; page <= end; page++) {
                if(usedPages.indexOf(page) === -1) {
                    if(index !== _index) {
                        usedPages.push(page);
                    }
                } else {
                    repeatedValues['_' + _index] = [page];
                }
            }
        });

        for(let page = 1; page <= pages; page++) {
            if(usedPages.indexOf(page) === -1) { 
                if(lastPage && ((page - lastPage) > 1)) {
                    possibleRanges.push(currentRange);
                    currentRange = [];
                } else {
                    currentRange.push(page);
                    lastPage = page;
                }
            }
        }

        if(currentRange.length) {
            possibleRanges.push(currentRange);
        }

        return possibleRanges;
    }

    getRangesFromUndefinedPages(pages) {
        const unselectedPages = this.getUnselectedPages(pages);
        let lastPage;
        let currentRange = [];
        const possibleRanges = [];
        unselectedPages.forEach(function (page) {
            if(lastPage && ((page - lastPage) > 1)) {
                possibleRanges.push(currentRange);
                currentRange = [];
            }
            currentRange.push(page);
            lastPage = page;
        });

        if(currentRange.length) {
            possibleRanges.push(currentRange);
        }

        return possibleRanges;
    }

    getValidStartRange(pages, value, index) {
        const documents = this.OTFormService.getDocuments();
        const document = documents[index];
        const possibleRanges = this.getRangesFromUndefinedPages(pages);
        const rangesFromDocuments = this.getRangesFromDocuments(pages, index);
        const nextPossibleRange = possibleRanges[0] || rangesFromDocuments[0];
        
        value = value || 0; // If value is undefined or null it's set to 0;

        if(document && document.rngRange && (document.rngRange.rangeStart > document.rngRange.rangeEnd)) {
            value = document.rngRange.rangeEnd;
        } else if(nextPossibleRange && nextPossibleRange.length) {
            if(value < nextPossibleRange[0]) {
                value = nextPossibleRange[0];
            } else if(value < 1) {
                value = 1;
            } else if(value > pages) {
                value = pages;
            }
        } else {
            if(value < 1) {
                value = 1;
            } else if(value > pages) {
                value = pages;
            }
        }
        
        return value;
    }

    getValidEndRange(pages, value, index) {
        const documents = this.OTFormService.getDocuments();
        const document = documents[index];
        const unselectedPages = this.getUnselectedPages(pages);
        const possibleRanges = this.getRangesFromUndefinedPages(pages);
        const rangesFromDocuments = this.getRangesFromDocuments(pages, index);
        const nextPossibleRange = possibleRanges[0] || rangesFromDocuments[0];
        const lenPossibleRange = nextPossibleRange.length;

        value = value || pages;
        if(value > pages) {
            value = pages;
        } 

        if(document && (document.rngRange.rangeEnd < document.rngRange.rangeStart)) {
            value = document.rngRange.rangeStart;
        } else if(nextPossibleRange && lenPossibleRange) {
            if(value > nextPossibleRange[lenPossibleRange -1]) {
                value = nextPossibleRange[lenPossibleRange -1];
            } else if(value > nextPossibleRange[lenPossibleRange -1]) {
                value = nextPossibleRange[lenPossibleRange -1];
            } else if(value < 1) {
                value = 1;
            } else if(value > pages) {
                value = pages;
            }
        } else {
            if(value < 1) {
                value = 1;
            } else if(value > pages) {
                value = pages;
            }
        }

        return value;
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
            if(!service.documents[i].rngRange) {
                service.documents[i].rngRange = {};
            }
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
