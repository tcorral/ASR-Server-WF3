class Validator {
	constructor(controller) {
		this.controller = controller;
	}
	
	fixStartRange(index, document, eventOrValue) {
        let value;
		const controller = this.controller;
        if (eventOrValue.target) {
            value = parseInt(eventOrValue.target.value, 10);
        } else {
            value = eventOrValue;
        }
        controller
            .DocumentsFormService
            .getMaxPageRange()
            .then(maxPages => {
                const validStartRange = controller.DocumentsFormService.getValidStartRange(maxPages, value, index);
                document.rngRange.rangeStart = validStartRange;
            });
    }
	
	fixEndRange(index, document, eventOrValue) {
        let value;
		const controller = this.controller;
        if (eventOrValue.target) {
            value = parseInt(eventOrValue.target.value, 10);
        } else {
            value = eventOrValue;
        }
        controller
            .DocumentsFormService
            .getMaxPageRange()
            .then(maxPages => {
                const validEndRange = controller.DocumentsFormService.getValidEndRange(maxPages, value, index);
                document.rngRange.rangeEnd = validEndRange;
            });
    }
}

export default Validator;
