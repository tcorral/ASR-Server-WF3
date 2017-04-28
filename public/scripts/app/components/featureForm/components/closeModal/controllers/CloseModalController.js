import EventBus from 'krasimir/EventBus';
import basicTemplate from '../templates/modal.html!text';

let listenerAdded = null;
const messages = {
    close: 'Are you sure you want to close without saving?',
    discard: 'Are you sure you want to discard this document?'
};
const events = {
    close: 'workflow:closed',
    discard: 'workflow:cancelled'
};

class CloseModalController {
    constructor($uibModal, $uibModalInstance) {
        this.$uibModal = $uibModal;
        this.$uibModalInstance = $uibModalInstance;
    }

    $onInit(){
        if(!listenerAdded) {
            EventBus.addEventListener('modal:close:open', this.showModal, this);
            listenerAdded = true;
        }
    }

    showModal(event) {
        const type = event.target || 'close';
        const template = basicTemplate.replace('%%MESSAGE%%', messages[type])
        this.$uibModalInstance = this
                                    .$uibModal
                                    .open({
                                        template,
                                        controller: () => {
                                            return this;
                                        },
                                        controllerAs: '$ctrl'
                                    });
        
        this.$uibModalInstance
                            .result
                            .then(function (res) {
                                if(res === true) {
                                    EventBus.dispatch(events[type]);
                                }
                            });
    }

    cancel() {
        this.$uibModalInstance.close(false);
    }
    accept() {
        this.$uibModalInstance.close(true);
    }
}

export default CloseModalController;