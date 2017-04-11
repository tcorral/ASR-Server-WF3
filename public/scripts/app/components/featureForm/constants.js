import validators from './validators';
import options from './options';
import WorkspaceCategoryController from './controllers/WorkspaceCategoryController';
import BusinessWorkspaceController from './controllers/BusinessWorkspaceController';
import MapNameController from './controllers/MapNameController';
import DocumentTypeController from './controllers/DocumentTypeController';
import BehandelaarController from './controllers/BehandelaarController';

WorkspaceCategoryController.$inject = ['$scope', 'FormService'];
BusinessWorkspaceController.$inject = ['$scope', 'FormService'];
MapNameController.$inject = ['$scope', 'FormService'];
DocumentTypeController.$inject = ['$scope', 'FormService'];
BehandelaarController.$inject = ['$scope', 'FormService', 'configEnv'];

export default {
    files: [
        {
            type: 'repeatSection',
            key: 'documentranges',
            templateOptions: {
                fields: [
                    {
                        className: 'display-flex',
                        fieldGroup: [
                            {
                                className: 'flex-1',
                                type: 'horizontalRange',
                                key: 'rangefrom',
                                templateOptions: {
                                    type: "number",
                                    label: 'Pagina',
                                    required: true,
                                    min: 1,
                                    max: Number.MAX_SAFE_INTEGER
                                }
                            },
                            {
                                className: 'flex-1',
                                type: 'horizontalRange',
                                key: 'rangeto',
                                templateOptions: {
                                    type: "number",
                                    label: 'tot',
                                    required: true,
                                    min: 1,
                                    max: Number.MAX_SAFE_INTEGER
                                }
                            },
                            {
                                className: 'flex-1',
                                type: 'horizontalCheckbox',
                                key: 'deleterange',
                                templateOptions: {
                                    label: 'Verwijder'
                                }
                            },{
                                className: 'flex-1',
                                key: 'workflowtype',
                                type: 'horizontalCheckbox',
                                templateOptions: {
                                    label: "Factuur"
                                },
                                hideExpression: 'model.deleterange'
                            },
                        ]
                    },
                    {
                        key: 'documentname',
                        type: 'horizontalInput',
                        templateOptions: {
                            label: 'Documentnaam',
                            placeholder: 'Geef een Documentnaam op'
                        },
                        validators: {
                            format: validators.formatDocumentName
                        },
                        expressionProperties: {
                            'templateOptions.required': '!model.deleterange'
                        },
                        hideExpression: 'model.deleterange'
                    },{
                        key: 'omschrijving',
                        type: 'horizontalInput',
                        templateOptions: {
                            label: "Omschrijving",
                            placeholder: "Geef een omschrijving"
                        },
                        hideExpression: 'model.deleterange || model.workflowtype'
                    },{
                        key: 'workspacecategory',
                        type: 'horizontalSelect',
                        templateOptions: {
                            label: 'Workspace Categorie',
                            options: [],
                            required: true
                        },
                        hideExpression: 'model.deleterange || model.workflowtype',
                        controller: WorkspaceCategoryController
                    },
                    {
                        key: 'businessworkspace',
                        type: 'typeahead',
                        templateOptions: {
                            label: 'Business Workspace',
                            required: true,
                            options: []
                        },
                        hideExpression: 'model.deleterange  || model.workflowtype',
                        expressionProperties: {
                            'templateOptions.disabled': '!model.workspacecategory'
                        },
                        controller: BusinessWorkspaceController
                    },
                    {
                        key: 'mapname',
                        type: 'horizontalSelect',
                        templateOptions: {
                            label: 'Mapnaam',
                            required: true,
                            options: []
                        },
                        hideExpression: 'model.deleterange  || model.workflowtype',
                        expressionProperties: {
                            'templateOptions.disabled': '!model.workspacecategory'
                        },
                        controller: MapNameController
                    },    {
                        key: 'documenttype',
                        type: 'horizontalSelect',
                        templateOptions: {
                            label: 'Document Type',
                            required: true,
                            options: []
                        },
                        hideExpression: 'model.deleterange || model.workflowtype',
                        expressionProperties: {
                            'templateOptions.disabled': '!model.mapname'
                        },
                        controller: DocumentTypeController
                    },
                    {
                        type: 'horizontalCheckbox',
                        key: 'followup',
                        templateOptions: {
                            label: 'Follow up'
                        },
                        hideExpression: 'model.deleterange  || model.workflowtype'
                    },
                    {
                        key: 'behandelaar',
                        type: 'typeahead',
                        templateOptions: {
                            label: 'Behandelaar',
                            required: true,
                            placeholder: 'Geef een behandelaar op',
                            options: []
                        },
                        hideExpression: '!model.followup || model.deleterange  || model.workflowtype',
                        controller: BehandelaarController
                    },
                    {
                        type: 'horizontalSelect',
                        key: 'followupdays',
                        templateOptions: {
                            label: 'Follow up binnen',
                            required: true,
                            placeholder: 'Geef een behandelaar op',
                            options: options.followupOptions
                        },
                        hideExpression: '!model.followup || model.deleterange  || model.workflowtype'
                    }
                ]
            }

        }
    ]
}
