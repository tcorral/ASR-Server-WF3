class SessionService {
    constructor($filter, $timeout, $log, MessageService) {
        const service = this;
        service.idleTimer = null;
        service.$filter = $filter;
        service.sessionTimeout = 900000;
        service.$timeout = $timeout;
        service.$log = $log;
        service.MessageService = MessageService;

        function init() {
            service.startTimer();
        }

        init();
    }

    startTimer() {
        this.idleTimer = this.$timeout(() => {
            this.stopTimer();
            this.MessageService.toggleWarning(this.$filter('translate')("Your session has expired. Reload the page to continue please (F5)"));
        }, this.sessionTimeout);
    }

    stopTimer() {
        if (this.idleTimer) {
            this.$timeout.cancel(this.i)
        }
    }

    resetTimer() {
        this.stopTimer();
        this.startTimer();
    }
}

export default {
    SessionService
};
