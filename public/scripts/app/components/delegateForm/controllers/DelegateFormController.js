import 'tameraydin/ngToast';
import EventBus from 'krasimir/EventBus';

class DelegateFormController {
    constructor($window, $filter, ngToast, DelegateFormService, UserService, OTFormService) {
        const ctrl = this;
        ctrl.$window = $window;
        ctrl.$filter = $filter;
        ctrl.lastButton = null;
        ctrl.UserService = UserService;
        ctrl.ngToast = ngToast;
        ctrl.DelegateFormService = DelegateFormService;
        ctrl.OTFormService = OTFormService;
        ctrl.fields = {
            mailbox: [],
            practitionersGroup: []
        };
        ctrl.model = {
            delegate: null,
            mailbox: null,
            practitionersGroup: null,
            comments: null
        };
    }

    $onInit() {
        this.DelegateFormService
                .getMailbox()
                .then((response) => {
                    this.fields.mailbox = response;
                    this.populate();
                });
        
        EventBus.addEventListener('workflow:cancelled', this.cancelWorkflow, this);
        EventBus.addEventListener('workflow:closed', this.closeWorkflow, this);
    }

    populate() {
        var data = this.OTFormService.getData();
        this.model.comments = data.Opmerkingen;
    }

    getToggleClass() {
        const objClass = {};
        const commonClassName = 'glyphicon-chevron-';
        objClass[commonClassName + (this.display ? 'up' : 'down')] = true;
        return objClass;
    }

    isDelegateButtonActive() {
        return ((this.model.delegate && this.model.delegate.value) || (this.model.practitionersGroup && this.model.practitionersGroup.value));
    }

    findUser(query) {
        return this.UserService
            .asyncFindUser(query);
    }

    toggle() {
        this.display = !this.display;
    }

    getPracticionersGroup(query) {
        this
            .DelegateFormService
            .getPracticionersGroup(query)
            .then((response) => {
                this.fields.practitionersGroup = response;
            });
    }

    activateProgress($event) {
        var $this = $($event.target);
        this.lastButton = $this;
        if(this.lastButton.button) {
            this.lastButton.button('loading');
        }
    }

    cancelProgress() {
        if(this.lastButton.button){
            this.lastButton.button('reset');
        }
    }

    closeWorkflow() {
        const urlParams = this.DelegateFormService.getUrlParams();
        this.$window.location = decodeURIComponent(urlParams.nexturl.split('&')[6].split('=')[1]);
    }

	cancelAssignment($event) {
        this.activateProgress($event);
        this
            .DelegateFormService
            .cancelAssignment(this.model.comments)
            .then((urlParams) => {
                this.cancelProgress();
                this.ngToast.create(this.$filter('translate')('Assignment is canceled, you will be redirected'));
                this.$window.location = decodeURIComponent(urlParams.nexturl.split('&')[6].split('=')[1]);
            });
    }
	
    cancelWorkflow() {
        this
            .DelegateFormService
            .cancelWorkflow()
            .then((urlParams) => {
                this.ngToast.create(this.$filter('translate')('Workflow is deleted, you will be redirected'));
                this.$window.location = decodeURIComponent(urlParams.nexturl.split('&')[6].split('=')[1]);
            });
    }

    delegateWorkflow($event) {
        this.activateProgress($event);
        this
            .DelegateFormService
            .delegateWorkflow(this.model.delegate, this.model.practitionersGroup, this.model.mailbox, this.model.comments)
            .then((urlParams) => {
                this.cancelProgress();
                this.ngToast.create(this.$filter('translate')('Assignments delegates'));
                this.$window.location = decodeURIComponent(urlParams.nexturl.split('&')[6].split('=')[1]);
            });
    }

    acceptAssignment($event) {
        this.activateProgress($event);
        this
            .DelegateFormService
            .acceptAssignment()
            .then((response) => {
                this.cancelProgress();
                this.ngToast.create(this.$filter('translate')('Command is accepted'));
                this.toggle();
                EventBus.dispatch('assignment:accepted');
            });
    }

}

export default DelegateFormController;
