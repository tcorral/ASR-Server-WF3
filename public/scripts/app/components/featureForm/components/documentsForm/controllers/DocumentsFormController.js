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
    }

    $onInit() {
        const documents = this.documents = this.getDocuments();
		this.getDocumentNamePatterns();
		
        documents.forEach((document, index) => {
            this.fields.push(angular.copy(this.fieldOptions));
            //this.populate(index);
        });
        
        EventBus.addEventListener('form:delivered', this.setForm, this);
        EventBus.dispatch('form:get');
    }

    // Reviewed
    isFormHidden(document) {
        return this.isCheckboxSelected(document.rngDelete)
    }

    populate(index) {
        const document = this.documents[index];
        const ctrl = this;
        if(!document.rngWorkflowType) {
            document.rngWorkflowType = this.form['workflowType[' + index + ']'][0].value;
        }
        if(!document.rngSpoed) {
            document.rngSpoed = this.form['speed[' + index + ']'][0].value;
        }
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
                                    ctrl.combineDocNameFields(index, document);
                                })
                            })
                    });
            });
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
                document.rngRange.rangeStart = validStartRange;
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
                document.rngRange.rangeEnd = validEndRange;
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

    hasError(name, $index) {
        const instanceName = name + '[' + $index + ']';
        let selectedOption;
        const input = document.querySelector('[name="' + instanceName + '"]');
        const formInput = this.form[instanceName];
        let result = false;
        if (this.existInputAndHasBeenModified(name, $index)) {
            if(name === 'docName') { debugger; }
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

    isDataSetInDocument(document, name) {
        return Boolean(document[name]);
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
        this.DocumentsFormService.copyForm(index);
        var copyFieldOptions = angular.copy(this.fields[index]);
        this.fields.splice(index, 0, copyFieldOptions);
    }

    addNewForm(index) {
        this.DocumentsFormService.addNewForm(index);
        this.fields.splice(index, 0, angular.copy(this.fieldOptions));
    }

    deleteForm(index) {
        this.DocumentsFormService.deleteForm(index);
    }
}

export default DocumentsFormController;