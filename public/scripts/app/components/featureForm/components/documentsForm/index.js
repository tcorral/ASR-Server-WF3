import DocumentsFormController from './controllers/DocumentsFormController';
import DocumentsFormService from './services/DocumentsFormService';
import template from './templates/form.html!text';

DocumentsFormController.$inject = ['$scope', '$filter', 'DocumentsFormService', 'OTFormService', 'UserService', 'validationPatterns', 'followUpOptions'];
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