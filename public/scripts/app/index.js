import angular from 'angular';
import 'angular-bootstrap';
import 'angular-sanitize';
import 'angular-translate';
import 'tameraydin/ngToast';
import 'tameraydin/ngToast';

import config from './config/index';

import utils from './utils/index';

import constants from './constants/index';
import FormController from './controllers/FormController';
import delegateFormComponent from './components/delegateForm/index';
import featureFormComponent from './components/featureForm/index';
import unselectedPagesFormComponent from './components/unselectedPagesForm/index';
import FormService from './services/FormService';
import PDFService from './services/PDFService';
import UserService from './services/UserService';
import OTFormService from './services/OTFormService';

const deps = [
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'pascalprecht.translate',
  'ngToast'
];

config.$inject = ['$translateProvider', 'ngToastProvider', '$locationProvider'];
PDFService.$inject = ['$window', '$q', '$http', 'configEnv'];
FormController.$inject = ['FormService', 'PDFService', 'configEnv', 'OTFormService'];
FormService.$inject = ['$window', '$http', 'configEnv', 'context', 'postBus'];
UserService.$inject = ['$http', 'configEnv'];
OTFormService.$inject = ['$q', 'configEnv', 'otMappingGetter'];

angular
  .module('formApp', deps)
  .config(config)
  .constant(constants)
  .controller(FormController)
  .service(PDFService)
  .service(FormService)
  .service(UserService)
  .service(OTFormService)
  .component(featureFormComponent.component.name, featureFormComponent.component.component)
  .component(delegateFormComponent.component.name, delegateFormComponent.component.component)
  .component(unselectedPagesFormComponent.component.name, unselectedPagesFormComponent.component.component)
  .service(delegateFormComponent.component.services)
  .service(unselectedPagesFormComponent.component.services);

angular.bootstrap(document.querySelector('.layout-container'), ['formApp']);
