import FeatureFormController from './controllers/FeatureFormController';
import FeatureFormService from './services/FeatureFormService';
import unselectedPagesFormComponent from './components/unselectedPagesForm/index';
import documentsFormComponent from './components/documentsForm/index';
import closeModalComponent from './components/closeModal/index';
import template from './templates/form.html!text';

FeatureFormController.$inject = ['$filter', '$window', 'ngToast', 'FeatureFormService'];
FeatureFormService.$inject = ['$q', '$http', 'configEnv', '$location', 'OTFormService', 'DelegateFormService'];

export default {
    component: {
        name: 'featureForm',
        component: {
            template: template,
            controller: FeatureFormController,
            bindings: {
                display: "="
            }
        },
        subcomponents: [
            unselectedPagesFormComponent,
            documentsFormComponent,
            closeModalComponent
        ],
        services: {FeatureFormService}
    }
};
