import angular from 'angular';

class OTFormService {
  constructor($q, configEnv) {
    this.$q = $q;
    this.config = configEnv;
    this.form = null;
    this.formElements = {};
  }

  getMainForm() {
    var deferred = this.$q.defer();
    var form = this.form || document.getElementById(this.config.otFormId);
    this.form = form;
    deferred.resolve(form);
    return deferred.promise;
  }

  getElementsCopy() {
    return angular.copy(this.form.elements);
  }
  getElementValue(name) {
    return this.form[name].value;
  }

  setElementValue(name, value) {
    if(Array.isArray(name)) {
      for(var i = 0, len = name.length; i < len; i++) {
        this.form[name[0]].value = value;
      }
    } else {
      this.form[name].value = value;
    }
  }

  loadForm(newFormElement) {
    var formElement = newFormElement || document.getElementById(this.config.otFormId);

  }

  //loadForm(newFormElement) {
  //  var formElement = newFormElement || document.getElementById(this.config.otFormId);
  //  if (newFormElement) {
  //    this.formElements = {};
  //  }
  //  formElement.elements.forEach(function(item) {
  //    var key;
  //    var rangeIndex;
  //    var element = {};
  //    var name;
  //    for (key in item) {
  //      if (item.hasOwnProperty(key)) {
  //        element[key] = item[key];
  //      }
  //    }
  //    name = element.name;
  //    if (name.substring(0, 6) === '_1_1_8') {
  //      this.numberOfRangeSplits = 1;
  //      rangeIndex = parseInt(name.substring(7, 8), 10);
  //      if (this.numberOfRangeSplits < rangeIndex) {
  //        this.numberOfRangeSplits = rangeIndex;
  //      }
  //    }
  //  });
  //}
}

export default {
  OTFormService
}
