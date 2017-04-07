import angular from 'angular';
import constants from './constants/index';
import 'angular-bootstrap';
import 'angular-messages';
import FormController from './controllers/FormController';
import delegateFormComponent from './components/delegateForm/index';
import featureFormComponent from './components/featureForm/index';
import FormService from './services/FormService';
import PDFService from './services/PDFService';
import run from './run/index';

const deps = [
    'formly',
    'formlyBootstrap',
    'ui.bootstrap',
    'ngMessages'
];

PDFService.$inject = ['$window', '$q', '$http', 'devConfig'];
FormController.$inject = ['FormService', 'PDFService', 'devConfig'];
FormService.$inject = ['$window', '$http', 'devConfig', 'context', 'postBus'];

angular
    .module('app', deps)
    .controller(FormController)
    .constant(constants)
    .service(PDFService)
    .service(FormService)
    .component(delegateFormComponent.name, delegateFormComponent.component)
    .component(featureFormComponent.name, featureFormComponent.component)
    .run();

angular.bootstrap(document.body, ['app']);