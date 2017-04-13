import UnselectedPagesFormController from './controllers/UnselectedPagesFormController';
import UnselectedPagesService from './services/UnselectedPagesService';
import template from './templates/form.html!text';

UnselectedPagesFormController.$inject = ['PDFService', 'UnselectedPagesService'];

export default {
    component: {
      name: 'unselectedPagesForm',
      component: {
        template: template,
        controller: UnselectedPagesFormController,
        bindings: {
            limit: '<',
            documentRanges: '='
        }
      },
      services: { UnselectedPagesService }
    }
};
