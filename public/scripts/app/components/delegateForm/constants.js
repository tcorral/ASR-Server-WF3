import PostBusController from './controllers/PostBusController';
import BehandelgroupController from './controllers/BehandelgroepController';

PostBusController.$inject = ['$scope', 'FormService'];
BehandelgroupController.$inject = ['$scope', 'FormService'];

export default {
    fields: [
        {
            key: 'postbus',
            type: 'horizontalSelect',
            templateOptions: {
                label: 'Postbus',
                options: [],
                required: true
            },
            controller: PostBusController

        },
        {
            key: 'behandelgroep',
            type: 'horizontalSelect',
            templateOptions: {
                label: 'Behandelgroep',
                options: [],
                required: true
            },
            expressionProperties: {
                'templateOptions.disabled': '!model.postbus'
            },
            controller: BehandelgroupController
        }

    ]
}