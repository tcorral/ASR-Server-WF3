import angular from 'angular';
import EventBus from 'krasimir/EventBus';

import Validator from '../validator/index';

class DocumentsFormController {
    constructor($filter, DocumentsFormService, OTFormService, UserService, validationPatterns, workflowtypeOptions, speedtypeOptions) {
        const ctrl = this;
        ctrl.$filter = $filter;
        ctrl.form = null;
        ctrl.documents = [];
        ctrl.OTFormService = OTFormService;
        ctrl.workflowtypeOptions = workflowtypeOptions;
        ctrl.speedtypeOptions = speedtypeOptions;
        ctrl.UserService = UserService;
        ctrl.DocumentsFormService = DocumentsFormService;
        ctrl.status = [];
        ctrl.targetFolderDisabled = [];
        ctrl.documentNamePatterns = [];
        ctrl.validationPatterns = validationPatterns;
        ctrl.fields = [];
        ctrl.fieldOptions = {
            workflowtypeOptions: workflowtypeOptions,
            speedtypeOptions: speedtypeOptions
        };
        ctrl.names = [];
        ctrl.nameFields = {
            docNameDocType: '',
            docNameTimestamp: new Date().toISOString().substring(0, 10).replace("-", "").replace("-", ""),
            docName: ''
        };
    }

    $onInit() {
        const ctrl = this;
        const documents = ctrl.documents = ctrl.getDocuments();
        ctrl.fieldOptions.followUpOptions = ctrl.followUpOptions.map((option) => {
            option.name = ctrl.$filter('translate')(option.name);
            return option;
        });
		ctrl.getDocumentNamePatterns();
		
        documents.forEach((document, index) => {
            ctrl.fields.push(angular.copy(ctrl.fieldOptions));
            ctrl.names.push(angular.copy(ctrl.nameFields));
            ctrl.targetFolderDisabled.push(true);
            ctrl.getWorkspaceCategoriesOptions(index);
            ctrl.populate(index);
        });
        
        EventBus.addEventListener('form:delivered', ctrl.setForm, ctrl);
        EventBus.dispatch('form:get');
    }

    getDocTypePattern(document) {
        var pattern = null;
        if (this.isFormHidden(document)) {
            pattern = this.validationPatterns.doctypePattern;
        }
        return pattern;
    }

    populate(index) {
        const document = this.documents[index];
        const ctrl = this;
        ctrl
            .getDocTypeGroupOptions(index, document)
            .then(function () {
                ctrl
                    .getBusinessWorkspaceName(document)
                    .then(function () {
                        ctrl
                            .getDocumentTypeOptions(index, document)
                            .then(function () {
                                ctrl
                                .setupDocumentType(index, document)
                                .then(function () {
                                    ctrl
                                    .getDoctypeSubfolderOptions(index, document)
                                    .then(function () {
                                        ctrl.combineDocNameFields(index, document);
                                    });
                                })
                            })
                    });
            });
    }
	
    getBusinessWorkspaceName(document) {
        return this
            .DocumentsFormService
            .getBusinessWorkspaceName(document)
            .then((name) => {
                document.rngBusinessWorkspace.name = name;
            });
    }

    extractDocName(index, document) {
        if (document) {
            const regex = /^(\d{8})-([a-z|A-Z]*)-([\s\S]*)$/g;
            let m;
            const keys = [
                "docNameTimestamp",
                "docNameDocType",
                "docName"
            ];

            while ((m = regex.exec(document.rngDocumentName)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                m.shift(); // Remove the full match.
                m.forEach((match, groupIndex) => {
                    this.names[index][keys[groupIndex]] = match;
                });
            }
        }
    }

    // Reviewed
    isFormHidden(document) {
        return (this.isCheckboxSelected(document.rngDelete) || this.isCheckboxSelected(document.rngWorkflowType));
    }

    fixStartRange(index, document, eventOrValue) {
        let value;
        if (eventOrValue.target) {
            value = parseInt(eventOrValue.target.value, 10);
        } else {
            value = eventOrValue;
        }
        this
            .DocumentsFormService
            .getMaxPageRange()
            .then(maxPages => {
                const validStartRange = this.DocumentsFormService.getValidStartRange(maxPages, value, index);
                if(validStartRange <= value) {
                    document.rngRange.rangeStart = validStartRange;
                }
            });
    }

    fixEndRange(index, document, eventOrValue) {
        let value;
        if (eventOrValue.target) {
            value = parseInt(eventOrValue.target.value, 10);
        } else {
            value = eventOrValue;
        }
        this
            .DocumentsFormService
            .getMaxPageRange()
            .then(maxPages => {
                const validEndRange = this.DocumentsFormService.getValidEndRange(maxPages, value, index);
                if(validEndRange >= value) {
                    document.rngRange.rangeEnd = validEndRange;
                }
            });
    }

    setForm(obj) {
        if (obj) {
            this.form = obj.target;
        }
    }

    hasDocNameRequiredError(index) {
        const fieldNames = {
            timestamp: 'docNameTimestamp[' + index + ']',
            doctype: 'docNameDocType[' + index + ']',
            docname: 'docName[' + index + ']'
        };
        let name;
        let result = false;

        if (this.form && this.form.$dirty && this.names[$index].docName) {
            for (let key in fieldNames) {
                if (fieldNames.hasOwnProperty(key)) {
                    name = fieldNames[key];
                    if (Boolean(this.form[name] && this.form[name].$error) === true) {
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

    getBusinessWorkspacePlaceholder($index) {
        var placeholder = '';
        if (this.hasRequiredError('businessWorkspace', $index)) {
            placeholder = this.$filter('translate')('Select a valid') + ' ' + this.$filter('translate')('Business Workspace');
        }
        return placeholder;
    }

    getBehandelaarPlaceholder($index) {
        var placeholder = '';
        if (this.hasBehandelaarRequiredError($index)) {
            placeholder = this.$filter('translate')('This field is required.');
        }
        return placeholder;
    }

    getFollowUpDatePlaceholder($index) {
        var placeholder = '';
        if (this.hasFollowUpdateRequiredError(document, $index)) {
            placeholder = this.$filter('translate')('This field is required.');
        }
        return placeholder;
    }

    hasFollowUpdateRequiredError(document, $index) {
        const instanceName = 'followUpDate[' + $index + ']';
        let result = false;
        if (this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required);
        }
        return result;
    }

    getDocumentNamePlaceholder($index) {
        var placeholder = this.$filter('translate')('Document name');
        if (this.hasInputError($index, 'docName', 'pattern')) {
            placeholder = this.$filter('translate')('There are invalid characters');
        } else if (this.hasInputError($index, 'docName', 'required')) {
            placeholder = this.$filter('translate')('This field is required.');
        }
    }

    hasInputError($index, name, errorName) {
        const field = this.form[name + '[' + $index + ']'];
        return (field && field.$error[errorName] && field.$dirty);
    }

    hasRequiredError(name, $index) {
        const instanceName = name + '[' + $index + ']';
        let result = false;
        if (this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required && this.form[instanceName].$dirty);
        }
        return result;
    }

    hasDocTypeRequiredError(document, $index) {
        const instanceName = 'documentType[' + $index + ']';
        let result = false;
        if (this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required && document.rngDocumenttype !== '');
        }
        return result;
    }

    hasBehandelaarRequiredError($index) {
        const instanceName = 'behandelaar[' + $index + ']';
        let result = false;
        if (this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required);
        }
        return result;
    }

    hasFollowUpBinnenRequiredError(document, $index) {
        const instanceName = 'followUpBinnen[' + $index + ']';
        let result = false;
        if (this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required && document.rngFollowupDays !== '');
        }
        return result;
    }

    hasWorkspaceRequiredError(document, $index) {
        const instanceName = 'workspaceCategorie[' + $index + ']';
        let result = false;
        if (this.existInputAndHasBeenModified(name, $index)) {
            result = Boolean(this.form[instanceName].$error && this.form[instanceName].$error.required && document.rngSapObject !== '');
        }
        return result;
    }

    hasError(name, $index) {
        const instanceName = name + '[' + $index + ']';
        let selectedOption;
        const input = document.querySelector('[name="' + instanceName + '"]');
        const formInput = this.form[instanceName];
        let result = false;
        if (this.existInputAndHasBeenModified(name, $index)) {
            if (input.nodeName.toLowerCase() === 'select') {
                selectedOption = input.options[input.selectedIndex];
                if(selectedOption) {
                    result = Boolean(selectedOption.getAttribute('label') == null || selectedOption.getAttribute('label').length === 0);
                }
            } else {
                result = Boolean(formInput.$invalid && formInput.$dirty);
            }
        }
        return result;
    }

    findUser(query) {
        return this.UserService
            .asyncFindUser(query);
    }

    isDeleteButtonDisabled() {
        const documents = this.OTFormService.getDocuments();
        return documents.length === 1;
    }

    isDatatypeGroupDisabled(document) {
        return Boolean(!document.rngSapObject || !this.isBusinessWorkspaceValid(document));
    }

    isDoctypeDisabled(document) {
        return Boolean(this.isPatternExclusion(document) || !document.rngDocumenttype);
    }

    isPossibleToAddAnotherRange() {
        return this.DocumentsFormService.isPossibleToAddAnotherRange();
    }

    getDocuments() {
        return this.DocumentsFormService.getDocuments();
    }

    isPatternExclusion(document) {
        let exclusion;
        let result = false;
        for (let i = 0, len = this.documentNamePatterns.length; i < len; i++) {
            exclusion = this.documentNamePatterns[i];
            if (exclusion.BWS === document.rngSapObject &&
                exclusion.DocGroup === document.rngDocumenttypeGroep &&
                exclusion.DocType === document.rngDocumenttype) {
                result = true;
                break;
            }
        }
        return result;
    }

    setupDocumentType(index, document) {
        if (document) {
            this.names[index].docNameDocType = document.rngDocumenttype;
			this.combineDocNameFields(index, document)
			return this.getDoctypeSubfolderOptions(index, document);
        }
    }

    getDocumentNamePatterns() {
        return this
            .DocumentsFormService
            .getDocumentNamePatterns()
            .then((documentNamePatterns) => {
                this.documentNamePatterns = documentNamePatterns;
            });
    }

    toggleDatePicker(index) {
        this.fields[index].showPicker = !this.fields[index].showPicker;
    }

    clearFields(index) {
        this.fields[index].docTypeGroupOptions = [];
        this.fields[index].businessWorkspaceOptions = [];
        this.fields[index].doctypeSubfolderOptions = [];
        this.fields[index].doctypeOptions = [];
        this.fields[index].followUpOptions = this.fieldOptions.followUpOptions;
        this.fields[index].showPicker = false;
    }

    clearBusinessWorkspace(index, document) {
        this
            .DocumentsFormService
            .clearBusinessWorkspace(document);
        this.clearFields(index);
        this.clearDocName(index);
		this.combineDocNameFields(index, document);
		this.clearDescription(document);
		this.clearDocTypeGroup(index, document);
		this.clearDocTypeName(index, document);
		this.clearSubfolderId(index, document);
    }

    combineDocNameFields(index, document) {
        if (this.names[index]) {
			this.extractDocName(index, document);
            document.rngDocumentName = this.names[index].docNameTimestamp + " " + (this.names[index].docNameDocType || '') + " " + (this.names[index].docName || '');
        }
    }

    getWorkspaceCategoriesOptions(index) {
        return this
            .DocumentsFormService
            .getWorkspaceCategoriesOptions()
            .then((workspaceCategoryOptions) => {
                this.fields[index].workspaceCategoryOptions = workspaceCategoryOptions;
            });
    }

    getBusinessWorkspaceOptions(index, document, $viewValue) {
        document.rngBusinessWorkspace = $viewValue;
        return this
            .DocumentsFormService
            .getBusinessWorkspaceOptions(document);
    }

    isBusinessWorkspaceValid(document) {
        return Boolean(document && document.rngBusinessWorkspace && document.rngBusinessWorkspace.name && document.rngBusinessWorkspace.value);
    }

    getDocumentTypeOptions(index, document) {
        return this
            .DocumentsFormService
            .getDocTypeOptions(document)
            .then(doctypeOptions => {
                this.fields[index].doctypeOptions = doctypeOptions;
            });
    }

    getDoctypeSubfolderOptions(index, document) {
        return this
            .DocumentsFormService
            .getDoctypeSubfolder(document)
            .then(subfolderId => {
                if(!document.rngFolderID) {
                    document.rngFolderID = subfolderId;
                }
                if(document.rngDocumenttypeGroep) {
                    this.targetFolderDisabled[index] = false;
                }
				this
                    .DocumentsFormService
                    .getSubfolderOptions(document)
                    .then(subfolderOptions => {
                        this.fields[index].doctypeSubfolderOptions = subfolderOptions;
                    });
            });
    }

    isCheckboxSelected(value) {
        value = Number(value);
        return value === 1;
    }

    isTargetFolderDisabled(index) {
        return this.targetFolderDisabled[index];
    }

    clearDocName(index) {
        if (this.names[index]) {
            this.names[index].docName = '';
            this.names[index].docNameDocType = '';
        }
    }
	
	clearDocTypeGroup(index, document) {
		this.DocumentsFormService.clearDocTypeGroup(document);
		this.fields[index].docTypeGroupOptions = [];
	}
	
	clearDocTypeName(index, document) {
		this.DocumentsFormService.clearDocTypeName(document);
		this.fields[index].doctypeOptions = [];
	}

	clearSubfolderId(index, document) {
		this.DocumentsFormService.clearSubfolderId(document);
		this.fields[index].doctypeSubfolderOptions = [];
		this.targetFolderDisabled[index] = true;
	}	
	
	clearWorkspaceCategorieDependingData(index, document) {
		this.form.$setPristine();
        this.clearFields(index);
		this.clearBusinessWorkspace(index, document);
		this.clearDocName(index);
		this.combineDocNameFields(index, document);
		this.clearDescription(document);
		this.clearDocTypeGroup(index, document);
		this.clearDocTypeName(index, document);
		this.clearSubfolderId(index, document);
	}

    clearDescription(document) {
        document.rngOmschrijving = '';
    }

    getDocTypeGroupOptions(index, document, clean) {
		this.fields[index].docTypeGroupOptions = [];
        return this
            .DocumentsFormService
            .getDocTypeGroupOptions(document)
            .then((docTypeGroupOptions) => {
				this.fields[index].docTypeGroupOptions = docTypeGroupOptions;
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
        const copyFieldOptions = angular.copy(this.fields[index]);
        const copyNameFields = angular.copy(this.names[index]);
        const targetFolderDisabled = this.targetFolderDisabled[index];
        this.fields.splice(index, 0, copyFieldOptions);
        this.getWorkspaceCategoriesOptions(index);
        this.names.splice(index, 0, copyNameFields);
        this.targetFolderDisabled.splice(index, 0, targetFolderDisabled);
    }

    addNewForm(index) {
        this.DocumentsFormService.addNewForm(index);
        this.fields.splice(index, 0, angular.copy(this.fieldOptions));
		this.getWorkspaceCategoriesOptions(index);
        this.names.splice(index, 0, angular.copy(this.nameFields));
        this.targetFolderDisabled.splice(index, 0, true);
    }

    deleteForm(index) {
        this.DocumentsFormService.deleteForm(index);
    }
}

export default DocumentsFormController;