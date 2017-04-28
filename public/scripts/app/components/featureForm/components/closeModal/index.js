import CloseModalController from './controllers/CloseModalController';
import template from './templates/modal.html!text';

CloseModalController.$inject = ['$uibModal'];

export default {
    component: {
        name: 'closeModal',
        component: {
            template: template,
            controller: CloseModalController,
            bindings: {}
        }
    }
};
