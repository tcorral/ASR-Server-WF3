import angular from "angular";
import EventBus from "krasimir/EventBus";

function getDataFromElements(params) {
  var oParams = {};
  for(var key in params) {
    if(params.hasOwnProperty(key) && params[key].name) {
      oParams[key] = {
        name: params[key].name,
        value: params[key].value
      };
    }
  }
  return oParams;
}
class DelegateFormService {
  constructor($q, $http, configEnv, mailbox, OTFormService) {
    this.$q = $q;
    this.$http = $http;
    this.config = configEnv;
    this.mailbox = mailbox;
    this.OTFormService = OTFormService;
  }

  post(formElements) {
    return this
      .$http({
        method: 'POST',
        url: '/otcs/llisapi.dll',
        data: JSON.stringify(getDataFromElements(formElements)),
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .then(function() {
        EventBus.dispatch("delegate-form:sent");
      })
  }

  getMailbox() {
    const deferred = this.$q.defer();
    deferred.resolve(this.mailbox);
    return deferred.promise;
  }

  getPracticionersGroup(query) {
    return this
      .$http({
        url: '', /*This is empty because we are pinging current url*/
        params: {
          func: 'll',
          objId: this.config.getgroup,
          filter: query,
          objAction: 'RunReport'
        }
      })
      .then(function(response) {
        const array = [];
        let i;
        let row;
        if (response.data.myRows) {
          for (i = 0; i < response.data.myRows.length; i++) {
            row = response.data.myRows[i];
            array.push({
              name: row.Name,
              value: row.ID
            });
          }
        }

        return array;
      });
  }

  delegateWorkflow() {
    var params = this.OTFormService.getElementsCopy();
    delete params['_1_1_8_1_14_1'];
    delete params['_1_1_8_1_14_1_Exists'];
    delete params['_1_1_8_1_18_1'];
    delete params['_1_1_8_1_18_1_Exists'];
    params['_1_1_23_1'].value = 'delegate';
    debugger;
    return this.post(params);
  }
}

export default DelegateFormService;
