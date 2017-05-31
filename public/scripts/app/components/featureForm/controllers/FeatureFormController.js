import EventBus from 'krasimir/EventBus';

class FeatureFormController {
    constructor($scope, $filter, $window, ngToast, FeatureFormService) {
        const ctrl = this;
        ctrl.display = false;
        ctrl.lastButon = null;
        ctrl.dataHasBeenChanged = false;
        ctrl.maxPages = 0;
        ctrl.unselectedRanges = [];
        ctrl.$scope = $scope;
        ctrl.$filter = $filter;
        ctrl.$window = $window;
        ctrl.ngToast = ngToast;
        ctrl.warning = {
            display: false,
            text: ''
        };
        ctrl.FeatureFormService = FeatureFormService;
    }

    $onInit() {
        EventBus.addEventListener('form:get', () => {
            EventBus.dispatch('form:delivered', this.featureForm);
        });
        EventBus.addEventListener('assignment:accepted', () => {
            this.display = true;
        });
        EventBus.addEventListener('show:warning', (warning) => {
            this.warning = warning.target;
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
    
    activateProgress($event) {
        var $this = $($event.target);
        this.lastButton = $this;
        this.lastButton.button('loading');
    }

    cancelProgress() {
        this.lastButton.button('reset');
    }

    isFormDataValid() {
        const form = this.featureForm;
        this.getUnselectedRanges();
        return form && form.$valid && this.unselectedRanges.length === 0;;
    }

    openCloseModal(type) {
        if(type === 'close' && !this.dataHasBeenChanged) {
            EventBus.dispatch('workflow:closed');
        } else {
            EventBus.dispatch('modal:close:open', type);
        }
    }

    saveForm($event) {
        this.activateProgress($event);
        this
            .FeatureFormService
            .saveForm()
            .then(() => {
                this.cancelProgress();
                this.ngToast.create(this.$filter('translate')('Workflow is saved'));
                this.dataHasBeenChanged = false;
                this.featureForm.$setPristine();
            });
    }

    getUnselectedRanges() {
        EventBus.addEventListener('unselected:get', (event) => {
            this.unselectedRanges = event.target;
        });
        EventBus.dispatch('unselected:request');
    }

    validateOrSaveAndFinish($event) {
        this.getUnselectedRanges();
        const ranges = this.unselectedRanges;
        if(this.featureForm.$valid && ranges.length === 0) {
            this.activateProgress($event);
            this
                .FeatureFormService
                .validateOrSaveAndFinish()
                .then((urlParams) => {
                    this.cancelProgress();
                    this.ngToast.create(this.$filter('translate')('Workflow is complete, you will be redirected'));
                    this.$window.location = decodeURIComponent(urlParams.nexturl.split('&')[6].split('=')[1]);
                    this.dataHasBeenChanged = false;
                    this.featureForm.$setPristine();
                });
        }
    }
}

export default FeatureFormController;