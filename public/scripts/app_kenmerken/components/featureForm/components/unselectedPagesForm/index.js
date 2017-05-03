import UnselectedPagesFormController from './controllers/UnselectedPagesFormController';
import UnselectedPagesService from './services/UnselectedPagesService';
import template from './templates/form.html!text';

UnselectedPagesFormController.$inject = ['UnselectedPagesService'];
UnselectedPagesService.$inject = ['$q', 'OTFormService', 'PDFService'];

export default {
    component: {
        name: 'unselectedPagesForm',
        component: {
            template: template,
            controller: UnselectedPagesFormController,
            bindings: {
                limit: '<'
            }
        },
        services: {UnselectedPagesService}
    }
};
