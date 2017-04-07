import DelegateFormController from './controllers/DelegateFormController';
import template from './templates/form.html!text';

export default {
    name: 'delegateForm',
    component: {
        template: template,
        controller: DelegateFormController
    },
    bindings: {
        form:  '='
    }
};