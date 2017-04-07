export default {
   formatDocumentName: function($viewValue, $modelValue){
        var value = $viewValue || $modelValue;
        // YYYYMMDD <space> Documentname. Documentname can only contain alphanumeric values and underscores. (?!.) invalidates the pattern when the documentname contains an illegal character
        var dateReg = /([0-9]{4}(0[1-9]|1[0-2])([0-2]{1}[0-9]{1}|3[0-1]{1})(\s){1}(\w{3,}(?!.)))/i;
        if(value){
            return dateReg.test(value);
        }else{
            return true;
        }
    }
};