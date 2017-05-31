import EventBus from 'krasimir/EventBus';

class MessageService {
    constructor() {
        this.messages = {
            warning: {
                display: false,
                text: ''
            }
        };
    }

    toggleWarning(text) {
        this.messages.warning.display = !this.messages.warning.display;
        this.messages.warning.text = text;
        EventBus.dispatch('show:warning',  {
            display: this.messages.warning.display,
            text: this.messages.warning.text
        });
    }
}

export default {
    MessageService
};