import DelegateFormController from './controllers/DelegateFormController';
import DelegateFormService from './services/DelegateFormService';
import template from './templates/form.html!text';

DelegateFormController.$inject = ['$filter', 'ngToast', 'DelegateFormService', 'UserService', 'OTFormService'];
DelegateFormService.$inject = ['$q', '$http', 'configEnv', 'mailbox', 'OTFormService'];

export default {
    component: {
      name: 'delegateForm',
      component: {
        template: template,
        controller: DelegateFormController
      },
      bindings: {
        display: '='
      }
    },
    services: { DelegateFormService }
};
