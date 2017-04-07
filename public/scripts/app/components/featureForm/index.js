import FeatureFormController from './controllers/FeatureFormController';
import template from './templates/form.html!text';

export default {
    name: 'featureForm',
    component: {
        template: template,
        controller: FeatureFormController
    },
    bindings: {
        form:  '=',
        contextIsKenmerk: '&'
    }
};