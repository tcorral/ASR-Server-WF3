import DocumentsFormController from './controllers/DocumentsFormController';
import DocumentsFormService from './services/DocumentsFormService';
import template from './templates/form.html!text';

DocumentsFormController.$inject = ['$filter', 'DocumentsFormService', 'OTFormService', 'UserService', 'validationPatterns', 'workflowtypeOptions', 'speedtypeOptions'];
DocumentsFormService.$inject = ['OTFormService', '$q', '$http', 'configEnv', 'SessionService', 'UnselectedPagesService'];

export default {
    component: {
        name: 'documentsForm',
        component: {
            template: template,
            controller: DocumentsFormController,
            bindings: {}
        },
        services: {DocumentsFormService}
    }
};