import angular from 'angular';
import EventBus from 'krasimir/EventBus';

class DocumentsFormController {
    constructor($filter, DocumentsFormService, OTFormService, UserService, validationPatterns, followUpOptions) {
        const ctrl = this;
        ctrl.$filter = $filter;
        ctrl.form = null;
        ctrl.documents = [];
        ctrl.OTFormService = OTFormService;
        ctrl.UserService = UserService;
        ctrl.followUpOptions = followUpOptions;
        ctrl.DocumentsFormService = DocumentsFormService;
        ctrl.status = [];
        ctrl.targetFolderDisabled = [];
        ctrl.documentNamePatterns = [];
        ctrl.validationPatterns = validationPatterns;
        ctrl.fields = {
            workspaceCategoryOptions: [],
            docTypeGroupOptions: [],
            businessWorkspaceOptions: [],
            doctypeSubfolderOptions: [],
            doctypeOptions: [],
            followUpOptions: [],
            showPicker: false
        };
        ctrl.names = [];
        ctrl.nameFields = {
            docNameDocType: '',
            docNameTimestamp: new Date().toISOString().substring(0, 10).replace("-","").replace("-",""),
            docName: ''
        };
    }
    
    $onInit() {
        this.documents = this.getDocuments();
        this.checkPopulatedFields();
        this.getWorkspaceCategoriesOptions();
        this.getDocumentNamePatterns();
        this.i18nFollowUpOptions();
        this.names.push(angular.copy(this.nameFields));
        EventBus.addEventListener('form:delivered', this.setForm, this);
        EventBus.dispatch('form:get');
    }

    checkPopulatedFields() {
        const lenDocuments = this.documents.length;
        let document;
        for(let i = 0; i < lenDocuments; i++) {
            document = this.documents[i];
            this.getDocTypeGroupOptions(i);
            this
                .getBusinessWorkspaceName(i, document)
                .then(() => {
                    this.setupDocumentType(i);
                });
            this.getDocumentTypeOptions(i);
            this.extractDocName(i, document);
            this.combineDocNameFields(i);
        }
    }

    getBusinessWorkspaceName(index, document) {
        return this
                .DocumentsFormService
                .getBusinessWorkspaceName(index)
                .then((name) => {
                    document.rngBusinessWorkspace.name = name;
                });
    }

    extractDocName(index, document) {
        const splitIndex = document.rngDocumentName.indexOf(document.rngDocumenttype) + (document.rngDocumenttype.length + 1);
        this.names.splice(index, 0, angular.copy(this.nameFields));
        this.names[index].docName = document.rngDocumentName.substr(splitIndex);
    }

    fixStartRange(index, eventOrValue){
        const document = this.OTFormService.getDocument(index);
        let value;
        if(eventOrValue.target) {
            value = parseInt(eventOrValue.target.value, 10);
        } else {
            value = eventOrValue;
        }
        this
            .DocumentsFormService
            .getMaxPageRange()
            .then(maxPages => {
                const validStartRange = this.DocumentsFormService.getValidStartRange(maxPages, value, index);
                document.rngRange.rangeStart = validStartRange;
            });
    }

    fixEndRange(index, eventOrValue){
        const document = this.OTFormService.getDocument(index);
        let value;
        if(eventOrValue.target) {
            value = parseInt(eventOrValue.target.value, 10);
        } else {
            value = eventOrValue;
        }
        this
            .DocumentsFormService
            .getMaxPageRange()
            .then(maxPages => {
                const validEndRange = this.DocumentsFormService.getValidEndRange(maxPages, value, index);
                document.rngRange.rangeEnd = validEndRange;
            });
    }

    setForm(obj) {
        if(obj) {
            this.form = obj.target;
        }
    }

    hasDocNameRequiredError(index) {
        const fieldNames = {
            timestamp: 'docNameTimestamp['+ index + ']',
            doctype: 'docNameDocType['+ index + ']',
            docname: 'docName['+ index + ']'
        };c
        let name;
        let result = false;

        if(this.form && this.form.$dirty && this.names[$index].docName) {
            for(let key in fieldNames) {
                if(fieldNames.hasOwnProperty(key)) {
                    name = fieldNames[key];
                    if(Boolean(this.form[name] && this.form[name].$error) === true) {
                        return true;
                    }
                }
            }
        }
        
        return result;
    } 

    existInputAndHasBeenModified(name, $index) {
        const instanceName = name + '[' + $index + ']';
        return this.form && this.form[instanceName] && this.form[instanceName].$dirty;
    }
    hasRequiredError(name, $index) {
        const instanceName = name + '[' + $index + ']';
        let result = false;
        if(this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required);
        }
        return result;
    }

    hasDocTypeRequiredError(document, $index) {
        const instanceName = 'documentType[' + $index + ']';
        let result = false;
        if(this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required && document.rngDocumenttype !== '');
        }
        return result;
    }

    hasBehandelaarRequiredError($index) {
        const instanceName = 'behandelaar[' + $index + ']';
        let result = false;
        if(this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required);
        }
        return result;
    }

    hasFollowUpBinnenRequiredError(document, $index) {
        const instanceName = 'followUpBinnen[' + $index + ']';
        let result = false;
        if(this.existInputAndHasBeenModified(name, $index)) {
            result =  Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required && document.rngFollowupDays !== '');
        }
        return result;
    }
    
    hasWorkspaceRequiredError(document, $index) {
        const instanceName = 'workspaceCategorie[' + $index + ']';
        let result = false;
        if(this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required && document.rngSapObject !== '');
        }
        return result;
    }

    hasError(name, $index) {
        const instanceName = name + '[' + $index + ']';
        let selectedOption;
        const input = document.querySelector('[name="' + instanceName + '"]');
        let result = false;
        if(this.existInputAndHasBeenModified(name, $index)) {
            if(input.nodeName.toLowerCase() === 'select') {
                selectedOption = input.options[input.selectedIndex]
                result = Boolean(selectedOption.getAttribute('label') == null || selectedOption.getAttribute('label').length === 0);
            } else {
                result = Boolean(input.$invalid && input.$dirty);
            }
        }
        return result;
    }

    findUser(query) {
        return this.UserService
            .asyncFindUser(query);
    }

    isDataSetInDocument(index, name) {
        const document = this.OTFormService.getDocument(index);
        return Boolean(document[name]);
    }

    isDeleteButtonDisabled(){
        const documents = this.OTFormService.getDocuments();
        return documents.length ===1;
    }

    isDatatypeGroupDisabled(index){
        const document = this.OTFormService.getDocument(index);
        return Boolean(!document.rngSapObject || !this.isBusinessWorkspaceValid(index));
    }
    isDoctypeDisabled(index) {
        const document = this.OTFormService.getDocument(index);
        return Boolean(this.isPatternExclusion(index) || !document.rngDocumenttype);
    }

    isPossibleToAddAnotherRange() {
        return this.DocumentsFormService.isPossibleToAddAnotherRange();
    }

    i18nFollowUpOptions() {
        this.fields.followUpOptions = this.followUpOptions.map((option) => {
            option.name = this.$filter('translate')(option.name);
            return option;
        });
    }

    getDocuments() {
        return this.DocumentsFormService.getDocuments();
    }

    isPatternExclusion(index) {
        const document = this.OTFormService.getDocument(index);
        let exclusion;
        let result = false;
        for(let i = 0, len = this.documentNamePatterns.length; i < len; i++) {
            exclusion = this.documentNamePatterns[i];
            if(exclusion.BWS === document.rngSapObject &&
                exclusion.DocGroup === document.rngDocumenttypeGroep &&
                exclusion.DocType === document.rngDocumenttype) {
					result = true;
                    break;
                }
        }
        return result;
    }

    setupDocumentType(index) {
        const document = this.OTFormService.getDocument(index);
        if(document) {
            this.fields.docNameDocType = document.rngDocumenttype
        }
        return this.getDoctypeSubfolderOptions(index);
    }

    getDocumentNamePatterns() {
        return this
                .DocumentsFormService
                .getDocumentNamePatterns()
                .then((documentNamePatterns) => {
                    this.documentNamePatterns = documentNamePatterns;
                });
    }

    toggleDatePicker() {
        this.fields.showPicker = !this.fields.showPicker;
    }

    clearBusinessWorkspace(index) {
        return this
                .DocumentsFormService
                .clearBusinessWorkspace(index);
    }

    combineDocNameFields(index) {
        const document = this.OTFormService.getDocument(index);
        if(this.names[index]) {
            this.names[index].docNameDocType = document.rngDocumenttype;
            document.rngDocumentName = this.names[index].docNameTimestamp + " " + (this.names[index].docNameDocType || '') + " " + (this.names[index].docName || '');
        }
        return document.rngDocumentName;
    }

    getWorkspaceCategoriesOptions() {
        return this
            .DocumentsFormService
            .getWorkspaceCategoriesOptions()
            .then((workspaceCategoryOptions) => {
                this.fields.workspaceCategoryOptions = workspaceCategoryOptions;
            });
    }

    getBusinessWorkspaceOptions(index) {
        return this
            .DocumentsFormService
            .getBusinessWorkspaceOptions(index)
            .then((businessWorkspaceOptions) => {
                this.fields.businessWorkspaceOptions = businessWorkspaceOptions;
            });
    }

    isBusinessWorkspaceValid(index) {
        const document = this.OTFormService.getDocument(index);
        return Boolean(document && document.rngBusinessWorkspace && document.rngBusinessWorkspace.name && document.rngBusinessWorkspace.value);
    }
    
    getDocumentTypeOptions(index) {
        return this
                .DocumentsFormService
                .getDocTypeOptions(index)
                .then(doctypeOptions => {
                    this.fields.doctypeOptions = doctypeOptions;
                });
    }

    getDoctypeSubfolderOptions(index) {
        const document = this.OTFormService.getDocument(index);
        return this
                .DocumentsFormService
                .getDoctypeSubfolder(index)
                .then(subfolderId =>{
                    document.rngFolderID = subfolderId;
                    this.targetFolderDisabled[index] = false;
                    this
                        .DocumentsFormService
                        .getSubfolderOptions(index)
                        .then(subfolderOptions => {
                            this.fields.doctypeSubfolderOptions = subfolderOptions;
                        });
                });
    }

    isCheckboxSelected(value) {
        value = Number(value);
        return value === 1;
    }

    isTargetFolderDisabled($index) {
        if(this.targetFolderDisabled[$index] == null) {
            return true;
        } else {
            return this.targetFolderDisabled[$index];
        }
    }

    clearDocName(index) {
        if(this.names[index]) {
            this.names[index].docName = '';
            this.names[index].docNameDocType = '';
        }
    }

    clearDescription(index) {
        const document = this.OTFormService.getDocument(index);
        document.rngOmschrijving = '';
    }

    getDocTypeGroupOptions(index, clean) {
        const document = this.OTFormService.getDocument(index);
        return this
            .DocumentsFormService
            .getDocTypeGroupOptions(index)
            .then((docTypeGroupOptions) => {
                this.fields.docTypeGroupOptions = docTypeGroupOptions;
                if(clean) {
                    this.clearBusinessWorkspace(index);
                    this.clearDocName(index);
                    this.clearDescription(index);
                    
                }
            });
    }

    collapse(index) {
        const ctrl = this;
        if (!ctrl.isCollapsed(index)) {
            ctrl.status[index] = 'collapsed';
        } else {
            ctrl.status[index] = null;
        }
    }

    isCollapsed(index) {
        return this.status[index] === 'collapsed';
    }

    getCollapseClass(index) {
        const objClass = {};
        const basicClassName = 'glyphicon-chevron-';
        let finalClassName;
        if (this.status[index] && this.status[index] === 'collapsed') {
            finalClassName = basicClassName + 'down';
        } else {
            finalClassName = basicClassName + 'up';
        }

        objClass[finalClassName] = true;
        return objClass;
    }

    copyForm(index) {
        this.DocumentsFormService.copyForm(index);
        this.names.splice(index, 0, angular.copy(this.nameFields));
    }

    addNewForm(index) {
        this.DocumentsFormService.addNewForm(index);
        this.names.splice(index, 0, angular.copy(this.nameFields));
    }

    deleteForm(index) {
        this.DocumentsFormService.deleteForm(index);
    }
}

export default DocumentsFormController;
