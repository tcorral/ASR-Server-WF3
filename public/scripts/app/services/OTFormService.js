import angular from 'angular';
import Utils from '../utils/index';

class OTFormService {
    constructor($q, configEnv, otMappingGetter, otMappingSetter, conditionalExcludeDataFields) {
        const service = this;
        service.$q = $q;
        service.config = configEnv;
        service.mappingG = otMappingGetter;
        service.mappingS = otMappingSetter;
        service.conditionalExcludeDataFields = conditionalExcludeDataFields;
        service.data = {loops: []};
        service.formData = {};
    }

    getDocuments() {
        const data = this.getData();
        return data.loops;
    }

    getDocument(index) {
        const data = this.getData();
        return data.loops[index]
    }

    getNewItem() {
        const data = this.getData();
        const document = angular.copy(data.loops[0]);
        return Utils.getClearObjectData(document);
    }

    setDataFromForm() {
        const simpleMapping = this.mappingG.single;
        const repeatMapping = this.mappingG.loop;
        let input;
        let inputs;
        let key;
        let i;
        let lenFields;
        const objectKeys = Object.keys(repeatMapping);
        const lenRepeatedItems = (document.querySelectorAll('[title="' + objectKeys[0] + '"]') || document.querySelectorAll('[name="' + objectKeys[0] + '"]')).length;

        for (key in simpleMapping) {
            if (simpleMapping.hasOwnProperty(key)) {
                input = document.querySelector('[title="' + key + '"]') || document.querySelector('[name="' + key + '"]');
                if(input) {
                    this.data[key] = simpleMapping[key](input);
                } else {
                    console.log('single:', key);
                }
            }
        }

        // Detect how much items are repeated;
        for (i = 0; i < lenRepeatedItems; i++) {
            this.data.loops[i] = {};
            for (key in repeatMapping) {
                if (repeatMapping.hasOwnProperty(key)) {
                    input = (document.querySelectorAll('[title="' + key + '"]') || document.querySelectorAll('[name="' + key + '"]'))[i];
                    if(input) {
                        this.data.loops[i][key] = repeatMapping[key](input);
                    } else {
                        console.log('loop:', key);
                    }
                }
            }
        }
    }

    isDataUnset() {
        return (Object.keys(this.data).length === 1 && Object.keys(this.data.loops).length === 0);
    }

    isFormDataUnset() {
        return Object.keys(this.formData).length === 1;
    }

    getData() {
        if (this.isDataUnset()) {
            this.setDataFromForm()
        }
        return this.data;
    }

    getFormData() {
        this.setFormDataFromData();
        return this.formData;
    }

    setFormDataFromData() {
        let key;
        let i;
        let item;
        const lenRepeatedItems = this.data.loops.length;
        const simpleMapping = this.mappingS.single;
        const simpleConditional = this.conditionalExcludeDataFields.single;
        const loopMapping = this.mappingS.loop;
        const loopConditional = this.conditionalExcludeDataFields.loop;
        let nameInputInLoop;
        let input;
        let value;
        let conditional;
        this.formData = {};

        for (key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                if (key === 'loops') {
                    continue;
                }
                input = document.querySelector('[title="' + key + '"]') || document.querySelector('[name="' + key + '"]');
                if(input){
                    value = this.data[key];
                    if (typeof simpleMapping[key] === 'function') {
                        value = simpleMapping[key](value);
                    }
                    conditional = simpleConditional[key];
                    if(!conditional || conditional(value))  {
                        this.formData[input.name] = value;
                    }
                }
            }
        }

        for (i = 0; i < lenRepeatedItems; i++) {
            item = this.data.loops[i];
            for (key in item) {
                if (item.hasOwnProperty(key)) {
                    input = document.querySelector('[title="' + key + '"]') || document.querySelector('[name="' + key + '"]');
                    if(input) {
                        nameInputInLoop = input.name.replace(/^((_\d){3})(_\d)/, function (match1, match2) {
                            return match2 + '_' + (i + 1);
                        });
                        value = this.data.loops[i][key];
                        if (typeof loopMapping[key] === 'function') {
                            value = loopMapping[key](value, item);
                        }
                        conditional = loopConditional[key];
                        if(!conditional || conditional(value))  {
                            this.formData[nameInputInLoop] = value;
                        }
                    }
                }
            }
        }
    }
}

export default {
    OTFormService
}
