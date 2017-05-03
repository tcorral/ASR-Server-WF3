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

    getDocTypeOptions(document) {
        let promise;
        if(document && document.rngSapObject && document.rngDocumenttypeGroep) {
            return this
                .$http({
                    url: '', /*This is empty on purpose because we are pinging current url*/
                    params: {
                        func: 'll',
                        objId: this.config.getdocumenttypes,
                        filter: document.rngSapObject,
                        filter2: document.rngDocumenttypeGroep,
                        objAction: 'RunReport'
                    }
                })
                .then(function (response) {
                    const docTypeOptions = [];
                    if(response.data && response.data.myRows && response.data.myRows.length) {
                        for (let i = 0; i < response.data.myRows.length; i++) {
                            docTypeOptions.push({
                                name:  response.data.myRows[i].Name,
                                value:  response.data.myRows[i].Name
                            })
                        }
                    }
                    return docTypeOptions;
                });
        } else {
            const deferred = this.$q.defer();
            deferred.resolve([]);
            promise = deferred.promise;
        }

        return promise;
    }

    clearBusinessWorkspace(document) {
        if(document) {
            document.rngBusinessWorkspace.name = '';
            document.rngBusinessWorkspace.value = 0;
        }
    }

	clearDocTypeGroup(document) {
		if(document) {
			document.rngDocumenttypeGroep = null;
		}
	}
	
	clearDocTypeName(document) {
		if(document) {
			document.rngDocumenttype = null;
		}
	}
	
	clearSubfolderId(document) {
		if(document) {
			document.rngFolderID = null;
		}
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

    getSubfolderOptions(document) {
        let promise;
        if(document && document.rngFolderID) {
            promise = this
                        .$http({
                            url: '',
                            params: {
                                func: 'll',
                                objId: this.config.getsubfolders,
                                objAction: 'RunReport',
                                inputLabel1: document.rngFolderID,
                                jsononly: true
                            }
                        })
                        .then(function (response) {
                            const subfolderOptions = [];
                            if(response.data && response.data.myRows && response.data.myRows.length) {
                                for (let i = 0; i < response.data.myRows.length; i++) {
                                    subfolderOptions.push({
                                        name:  response.data.myRows[i].Path,
                                        value:  response.data.myRows[i].DataID
                                    })
                                }
                            }
                            return subfolderOptions;
                        });
        } else {
            const deferred = this.$q.defer();
            deferred.resolve([]);
            promise = deferred.promise;
        }
        return promise;
    }

    getBusinessWorkspaceName(document) {
        let promise;
        if(document && document.rngBusinessWorkspace.value) {
            promise = this
                .$http({
                    url: '',
                    params: {
                        func: 'll',
                        objId: this.config.getbusinessworkspacename,
                        objAction: 'RunReport',
                        ID: document.rngBusinessWorkspace.value,
                        Type: 'BW'
                    }
                })
                .then((response) => {
                    return response.data.NAME || 'Business Workspace '+ document.rngBusinessWorkspace.value;
                });
        } else {
            const deferred = this.$q.defer();
            deferred.resolve([]);
            promise = deferred.promise;
        }

        return promise;
    }

    getDoctypeSubfolder(document) {
        let promise;
        if(document && document.rngBusinessWorkspace.name && document.rngBusinessWorkspace.value && 
            document.rngSapObject && document.rngDocumenttypeGroep) {
            promise = this
                .$http({
                    url: '',
                    params: {
                        func: 'll',
                        objId: this.config.getsubfolderid,
                        objAction: 'RunReport',
                        inputLabel1: document.rngSapObject,
                        inputLabel2: document.rngDocumenttypeGroep,
                        inputLabel3: document.rngBusinessWorkspace.value
                    }
                })
                .then((response) => {
                    if(response && response.data && response.data.myRows && response.data.myRows.length) {
                        this.SessionService.resetTimer();
                        return response.data.myRows[0].DoelFolder;
                    } else {
                        return 0;
                    }
                });
        } else {
            const deferred = this.$q.defer();
            deferred.resolve([]);
            promise = deferred.promise;
        }

        return promise;
    }   

    getBusinessWorkspaceOptions(document) {
        let promise;
        if(document && document.rngSapObject && document.rngBusinessWorkspace) {
            promise = this
                    .$http({
                        url: '',
                        params: {
                            func: 'll',
                            objId: this.config.getbusinessworkspace,
                            filter: document.rngSapObject,
                            filter2: document.rngBusinessWorkspace,
                            objAction: 'RunReport'
                        }
                    })
                    .then(response => {
                        const businessWorkspaces = [];
                        if(response.data && response.data.myRows && response.data.myRows.length) {
                            for (let i = 0; i < response.data.myRows.length; i++) {
                                businessWorkspaces.push({
                                    name: response.data.myRows[i].Name,
                                    value: response.data.myRows[i].DataID
                                });
                            }
                        }
                        this.SessionService.resetTimer();
                        return businessWorkspaces;
                    });
        } else {
            const deferred = this.$q.defer();
            deferred.resolve(null);
            promise = deferred.promise;
        }
        return promise;
    }

    getDocTypeGroupOptions(document) {
        let promise;
        if(document && document.rngSapObject) {
            promise = this
                .$http({
                    url: '',
                    params: {
                        func: 'll',
                        objId: this.config.getdocumentgroups,
                        filter: document.rngSapObject,
                        objAction: 'RunReport'
                    }
                })
                .then((response) => {
                    const docTypeGroups = [];
                    if(response.data && response.data.myRows && response.data.myRows.length) {
                        for (let i = 0; i < response.data.myRows.length; i++) {
                            docTypeGroups.push({
                                name: response.data.myRows[i].Name,
                                value: response.data.myRows[i].Name
                            });
                        }
                    }
                    this.SessionService.resetTimer();
                    return docTypeGroups;
                });
        } else {
            const deferred = this.$q.defer();
            deferred.resolve(null);
            promise = deferred.promise;
        }
        
        return promise;
    }

    getWorkspaceCategoriesOptions() {
        return this
            .$http({
                url: '',
                params: {
                    func: 'll',
                    objId: this.config.getsapobjects,
                    objAction: 'RunReport'
                }
            })
            .then((response) => {
                const categories = [];
                if(response.data && response.data.myRows && response.data.myRows.length) {
                    for (let i = 0; i < response.data.myRows.length; i++) {
                        categories.push({
                            name: response.data.myRows[i].Name,
                            value: response.data.myRows[i].Name
                        });
                    }
                }
                this.SessionService.resetTimer();
                return categories;
            });
    }

    getDocuments() {
        return this.OTFormService.getDocuments();
    }

    copyForm(index) {
        this
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
        this
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
