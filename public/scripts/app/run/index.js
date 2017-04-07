import types from './formly/types/index';
import wrappers from './formly/wrappers/index';
import validationMessages from './formly/validation-messages/index';

export default function (formlyConfig, formlyValidationMessages) {
    var key;
    for(key in wrappers) {
        if(wrappers.hasOwnProperty(key)) {
            formlyConfig.setWrapper(wrappers[key]);
        }
    }
    for(key in types) {
        if(types.hasOwnProperty(key)) {
            formlyConfig.setType(types[key]);
        }
    }
    for(key in validationMessages) {
        if(validationMessages.hasOwnProperty(key)) {
            formlyValidationMessages.addStringMessage(key, validationMessages[key]);
        }
    }
};