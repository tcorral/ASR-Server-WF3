import EventBus from 'krasimir/EventBus';

class FeatureFormController {
    constructor($scope, $filter, $window, ngToast, FeatureFormService) {
        const ctrl = this;
        ctrl.display = false;
        ctrl.dataHasBeenChanged = false;
        ctrl.maxPages = 0;
        ctrl.$scope = $scope;
        ctrl.$filter = $filter;
        ctrl.$window = $window;
        ctrl.ngToast = ngToast;
        ctrl.FeatureFormService = FeatureFormService;
    }

    $onInit() {
        EventBus.addEventListener('form:get', () => {
            EventBus.dispatch('form:delivered', this.featureForm);
        });
        EventBus.addEventListener('assignment:accepted', () => {
            this.display = true;
        });
        this.$scope.$watch((scope) => { 
            var form = this.featureForm;
            if(form) {
                return this.featureForm.$dirty;
            }
        }, (newVal, oldVal) => {
            if (typeof newVal !== 'undefined' && newVal === true) {
                this.dataHasBeenChanged = true;
            }
        });
    }

    isFormDataValid() {
        var form = this.featureForm;
        var result = false;
        if(form) {
            result = this.featureForm.$valid;
        }
        return result;
    }

    openCloseModal(type) {
        EventBus.dispatch('modal:close:open', type);
    }

    saveForm() {
        this
            .FeatureFormService
            .saveForm()
            .then(() => {
                this.ngToast.create(this.$filter('translate')('Workflow is saved'));
                this.dataHasBeenChanged = false;
                this.featureForm.$setPristine();
            });
    }

    validateOrSaveAndFinish() {
        if(this.featureForm.$valid) {
            this
                .FeatureFormService
                .validateOrSaveAndFinish()
                .then((urlParams) => {
                    this.ngToast.create(this.$filter('translate')('Workflow is complete, you will be redirected'));
                    this.$window.location = decodeURIComponent(urlParams.nexturl.split('&')[6].split('=')[1]);
                    this.dataHasBeenChanged = false;
                    this.featureForm.$setPristine();
                });
        }
    }
}

export default FeatureFormController;