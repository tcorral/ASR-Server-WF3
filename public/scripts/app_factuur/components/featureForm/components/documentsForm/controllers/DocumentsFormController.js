const regExpDocName = /^(\d{8})-([a-z|A-Z]*)-([\s\S]*)$/g;

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
        ctrl.getDocumentNamePatterns();
		
        documents.forEach((document, index) => {
            ctrl.fields.push(angular.copy(ctrl.fieldOptions));
            ctrl.names.push(angular.copy(ctrl.nameFields));
            ctrl.fixNameData(index, document);
            document.rngWorkflowType = document.rngWorkflowType || ctrl.fields[index].workflowtypeOptions[0].value;
            document.rngSpoed = document.rngSpoed || ctrl.fields[index].speedtypeOptions[0].value;
        });
        
        EventBus.addEventListener('form:delivered', ctrl.setForm, ctrl);
        EventBus.dispatch('form:get');
    }

    fixNameData(index, document) {
        const ctrl = this;
        ctrl.extractDocName(index, document);
        if(!ctrl.names[index].docNameDocType) {
            ctrl.names[index].docNameDocType = ctrl.fields[index].workflowtypeOptions[0].value;
        }
        this.setDocumentName(document, index);
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
        return this.isCheckboxSelected(document.rngDelete);
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

    isDocNameDisabled() {
        return this.documents.length === 1;
    }

    setDocumentName(document, index) {
        const item = this.names[index];
        document.rngDocumentName = (item.docNameTimestamp || '') + '-' + (item.docNameDocType || '') + '-' + (item.docName || '');
    }

    hasDocNameRequiredError(index) {
        const fieldNames = {
            docNameTimestamp: 'docNameTimestamp[' + index + ']',
            docNameDocType: 'docNameDocType[' + index + ']',
            docName: 'docName[' + index + ']'
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

    getNameModel(index, property) {
        return this.names[index][property];
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

    getDocumentNamePatterns() {
        return this
            .DocumentsFormService
            .getDocumentNamePatterns()
            .then((documentNamePatterns) => {
                this.documentNamePatterns = documentNamePatterns;
            });
    }

    isCheckboxSelected(value) {
        value = Number(value);
        return value === 1;
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
        const copyFieldOptions = angular.copy(this.fields[index]);
        const copyNameFields = angular.copy(this.names[index]);
        this.fields.splice(index, 0, copyFieldOptions);
        this.names.splice(index, 0, copyNameFields);
        this.DocumentsFormService.copyForm(index)
        .then(() => {
            this.documents[index].rngWorkflowType = this.documents[index].rngWorkflowType || this.fields[index].workflowtypeOptions[0].value;
            this.documents[index].rngSpoed = this.documents[index].rngSpoed || this.fields[index].speedtypeOptions[0].value;
            this.fixNameData(index, this.documents[index]);
        });
    }

    addNewForm(index) {
        this.fields.splice(index, 0, angular.copy(this.fieldOptions));
        this.names.splice(index, 0, angular.copy(this.nameFields));
        this.DocumentsFormService.addNewForm(index)
        .then(() => {
            this.documents[index].rngWorkflowType = this.fields[index].workflowtypeOptions[0].value;
            this.documents[index].rngSpoed = this.fields[index].speedtypeOptions[0].value;
            this.fixNameData(index, this.documents[index]);
        });
    }

    deleteForm(index) {
        this.DocumentsFormService.deleteForm(index);
    }
}

export default DocumentsFormController;