import 'angular-bootstrap';
import 'angular-sanitize';
import 'angular-translate';
import 'tameraydin/ngToast';
import 'tameraydin/ngToast';

import config from 'app/config/index';
import utils from 'app/utils/index';
import constants from 'app/constants/index';

// Controllers
import FormController from 'app/controllers/FormController';

// Services
import PDFService from 'app/services/PDFService';
import UserService from 'app/services/UserService';
import OTFormService from 'app/services/OTFormService';
import SessionService from 'app/services/SessionService';
import MessageService from 'app/services/MessageService';


// Components
import delegateFormComponent from 'app/components/delegateForm/index';
import featureFormComponent from 'app/components/featureForm/index';

const deps = [
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'pascalprecht.translate',
    'ngToast'
];

config.$inject = ['$translateProvider', 'ngToastProvider', '$locationProvider'];
PDFService.PDFService.$inject = ['$window', '$q', '$http', 'configEnv'];
FormController.FormController.$inject = ['PDFService'];
UserService.UserService.$inject = ['$http', 'configEnv'];
OTFormService.OTFormService.$inject = ['$q', '$filter','configEnv', 'otMappingGetter', 'otMappingSetter', 'conditionalExcludeDataFields'];
SessionService.SessionService.$inject = ['$filter', '$timeout', '$log', 'MessageService'];

const formAppModule = angular
    .module('formApp', deps)
    .config(config)
    .constant(constants)
    .controller(FormController)
    .service(PDFService)
    .service(UserService)
    .service(OTFormService)
    .service(SessionService)
    .service(MessageService);

utils.addComponentsRecursive(formAppModule, [delegateFormComponent, featureFormComponent]);

angular.bootstrap(document.querySelector('.layout-container'), ['formApp']);
