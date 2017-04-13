import FeatureFormController from './controllers/FeatureFormController';
import template from './templates/form.html!text';

export default {
    component: {
      name: 'featureForm',
      component: {
        template: template,
        controller: FeatureFormController,
        bindings: {
            display: '='
        }
      }
    }
};
