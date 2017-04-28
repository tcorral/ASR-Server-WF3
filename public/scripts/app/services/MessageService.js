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
    }
}

export default {
    MessageService
};