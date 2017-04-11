import 'tameraydin/ngToast';

function delegateToPerson(model, OTFormService) {
  OTFormService.setElementValue(['_1_1_27_1_Name', '_1_1_27_1_SavedName'], model.delegate.name);
  OTFormService.setElementValue('_1_1_27_1_ID', model.delegate.value);
}

function delegateToMailbox(model, OTFormService) {
  OTFormService.setElementValue(['_1_1_27_1_Name', '_1_1_27_1_SavedName'], model.practitionersGroup.name);
  OTFormService.setElementValue('_1_1_27_1_ID', model.practitionersGroup.value);
  OTFormService.setElementValue('_1_1_28_1', model.mailbox.name);
}

class DelegateFormController {
  constructor($filter, ngToast, DelegateFormService, UserService, OTFormService) {
    const ctrl = this;
    ctrl.$filter = $filter;
    ctrl.UserService = UserService;
    ctrl.ngToast = ngToast;
    ctrl.DelegateFormService = DelegateFormService;
    ctrl.OTFormService = OTFormService;
    ctrl.fields = {
      mailbox: [],
      practitionersGroup: []
    };
    ctrl.otMainForm = null;
    ctrl.display = true;
    ctrl.model = {
      delegate: null,
      mailbox: null,
      practitionersGroup: null,
      comments: null
    };

    function init() {
      OTFormService
        .getMainForm()
        .then(function(response) {
          ctrl.otMainForm = response;
        });

      DelegateFormService
        .getMailbox()
        .then(function(response) {
          ctrl.fields.mailbox = response;
        });
    }

    init();
  }

  isDelegateButtonActive() {
    return (this.model.delegate || this.model.practitionersGroup);
  }

  findUser(query) {
    return this.UserService
      .asyncFindUser(query);
  }

  toggle() {
    this.display = !this.display;
  }

  getPracticionersGroup(query) {
    this.DelegateFormService
      .getPracticionersGroup(query)
      .then((response) => {
        this.fields.practitionersGroup = response;
      });
  }

  cancelWorflow() {
    var mailbox = this.OTFormService.getElementValue('_1_1_28_1').value;
    var group = mailbox.toUpperCase() + '-Postverdeling';
    this.OTFormService.setElementValue(['_1_1_27_1_Name', '_1_1_27_1_SavedName'], group);
    this.OTFormService.setElementValue('_1_1_28_1', mailbox);

    this.DelegateFormService
      .getPracticionersGroup(group)
      .then((response) => {
        this.OTFormService.setElementValue('_1_1_27_1_ID', res[0].value);
      })
      .then((response) => {
        DelegateFormService
          .delegateWorkflow();
      });
  }

  delegateWorkflow() {
    if (this.model.delegate && this.model.delegate.value) {
      delegateToPerson(this.model, this.OTFormService);
    } else {
      delegateToMailbox(this.model, this.OTFormService);
    }
    this.DelegateFormService
      .delegateWorkflow()
      .then(() => {
        this.ngToast.create(this.$filter('translate')('Assignments delegates'));
      });
  }

  acceptAssignment() {
    console.log(' accept assignment ');
  }

}

export default DelegateFormController;
