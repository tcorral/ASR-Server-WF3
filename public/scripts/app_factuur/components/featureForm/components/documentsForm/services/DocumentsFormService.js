import angular from 'angular';
import Utils from '../../../../../utils/index';

class DocumentsFormService {
    constructor(OTFormService, $q, $http, configEnv, SessionService, UnselectedPagesService) {
        const service = this;
        service.config = configEnv;
        service.$q = $q;
        service.$http = $http;
        service.UnselectedPagesService = UnselectedPagesService;
        service.OTFormService = OTFormService;
        service.SessionService = SessionService;
    }

    getValidStartRange(pages, value, index) {
        return this.UnselectedPagesService.getValidStartRange(pages, value, index);
    }

    getValidEndRange(pages, value, index) {
        return this.UnselectedPagesService.getValidEndRange(pages, value, index);
    }

    getMaxPageRange() {
        return this.UnselectedPagesService.getPDFPages();
    }

    isPossibleToAddAnotherRange() {
        const sync = true;
        const pages = this.UnselectedPagesService.getPDFPages(sync);
        return this.UnselectedPagesService.getUnselectedPages(pages).length > 0;
    }
    
    getDocuments() {
        return this.OTFormService.getDocuments();
    }
    
    getDocumentNamePatterns() {
        return this
                .$http({
                    url: '',
                    params: {
                        func: 'll',
                        objId: this.config.getexclusionpatterns,
                        objAction: 'RunReport'
                    }
                })
                .then((response) => {
                    const documentNamePatterns = [];
                    let len = 0;
                    if(response.data && response.data.myRows) {
                        len = response.data.myRows.length;
                    }
                    for(let i = 0; i < len; i++){
						documentNamePatterns.push(response.data.myRows[i]);
					}
                    this.SessionService.resetTimer();
                    return documentNamePatterns;
                });
    }

    copyForm(index) {
        return this
            .UnselectedPagesService
            .getPDFPages()
            .then(pages => {
                let promise;
                const unselectedPages = this.UnselectedPagesService.getUnselectedPages(pages);
                if(unselectedPages.length) {
                    const documents = this.getDocuments();
                    const document = angular.copy(documents[index]);
                    documents.splice(index, 0, document);
                    promise = this
                                .UnselectedPagesService
                                .getPDFPages()
                                .then(pages => {
                                    document.rngRange.rangeStart = this.getValidStartRange(pages, 0);
                                    document.rngRange.rangeEnd = this.getValidEndRange(pages, Number.MAX_SAFE_INTEGER);
                                    return document;
                                });
                } else {
                    const deferred = this.$q.defer();
                    deferred.resolve(null);
                    promise = deferred.promise;
                }
                return promise;
            });
    }

    addNewForm(index) {
        return this
            .UnselectedPagesService
            .getPDFPages()
            .then(pages => {
                let promise;
                const unselectedPages = this.UnselectedPagesService.getUnselectedPages(pages);
                if(unselectedPages.length) {
                    const documents = this.getDocuments();
                    const newDocument = this.OTFormService.getNewItem();
                    documents.splice(index, 0, newDocument);
                    promise = this
                                .UnselectedPagesService
                                .getPDFPages()
                                .then(pages => {
                                    newDocument.rngRange.rangeStart = this.getValidStartRange(pages, 0);
                                    newDocument.rngRange.rangeEnd = this.getValidEndRange(pages, Number.MAX_SAFE_INTEGER);
                                    return newDocument;
                                });
                } else {
                    const deferred = this.$q.defer();
                    deferred.resolve(null);
                    promise = deferred.promise;
                }
                return promise;
            });
    }

    deleteForm(index) {
        const documents = this.getDocuments();
        if (documents.length > 1) {
            documents.splice(index, 1);
        }
    }
}

export default DocumentsFormService;
