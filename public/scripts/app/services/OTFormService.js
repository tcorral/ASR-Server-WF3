import angular from 'angular';

class OTFormService {
  constructor($q, configEnv, otMappingGetter, otMappingSetter) {
    this.$q = $q;
    this.config = configEnv;
    this.mappingG = otMappingGetter;
    this.mappingS = otMappingSetter;
    this.form = null;
    this.formElements = {};
    this.data = { loops: []};
    this.formData = {};
    this.getDataFromForm();
    this.setFormDataFromData();
  }

  getDataFromForm() {
    var simpleMapping = this.mappingG.single;
    var repeatMapping = this.mappingG.loop;
    var input;
    var inputs;
    var key;
    var i;
    var lenFields;
    var objectKeys = Object.keys(repeatMapping);
    var lenRepeatedItems = (document.querySelectorAll('[title="' + objectKeys[0] + '"]') || document.querySelectorAll('[name="' + objectKeys[0] + '"]')).length;

    for(key in simpleMapping) {
      if(simpleMapping.hasOwnProperty(key)) {
        input = document.querySelector('[title="' + key + '"]') || document.querySelector('[name="' + key + '"]');
        this.data[key] = simpleMapping[key](input);
      }
    }

    // Detect how much items are repeated;
    for(i = 0; i < lenRepeatedItems; i++) {
      this.data.loops[i] = {};
      for(key in repeatMapping) {
        if(repeatMapping.hasOwnProperty(key)) {
          input = (document.querySelectorAll('[title="' + key + '"]') || document.querySelectorAll('[name="' + key + '"]'))[i];
          this.data.loops[i][key] = repeatMapping[key](input);
        }
      }
    }
    console.log(this.data);
    return this.data;
  }

  setFormDataFromData() {
    var key;
    var i;
    var item;
    var lenRepeatedItems = this.data.loops.length;
    var simpleMapping = this.mappingS.single;
    var loopMapping = this.mappingS.loop;
    var nameInputInLoop;
    var input;
    var value;

    for(key in this.data) {
      if(this.data.hasOwnProperty(key)) {
        if(key === 'loops') {
          continue;
        } 
        input = document.querySelector('[title="' + key + '"]') || document.querySelector('[name="' + key + '"]');
        value = this.data[key];
        if(typeof simpleMapping[key] === 'function') {
          value = simpleMapping[key](value);
        }
        this.formData[input.name] = value;
      }
    }

    for(i = 0; i < lenRepeatedItems; i++) {
      item = this.data.loops[i];
      for(key in item) {
        if(item.hasOwnProperty(key)) {
          input = document.querySelector('[title="' + key + '"]') || document.querySelector('[name="' + key + '"]')[i];
          nameInputInLoop = input.name.replace(/(_\d){3}/g, function ($0) {
            return $0 + '_' + i;
          });
          value = this.data.loops[i][key];
          if(typeof loopMapping[key] === 'function') {
            value = loopMapping[key](value);
          }
          this.formData[nameInputInLoop] = value
        }
      }
    }

    console.log(this.formData);
    return this.formData;
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
