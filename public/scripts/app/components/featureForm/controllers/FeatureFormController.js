import EventBus from 'krasimir/EventBus';

class FeatureFormController {
    constructor($filter, $window, ngToast, FeatureFormService) {
        const ctrl = this;
        ctrl.display = false;
        ctrl.maxPages = 0;
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
                });
        }
    }
}

export default FeatureFormController;