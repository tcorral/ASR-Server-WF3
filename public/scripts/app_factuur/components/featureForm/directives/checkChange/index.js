import EventBus from 'krasimir/EventBus';

// directive that checks for changes in the input fields and dropdowns. Used for detecting differences.
export default function () {
	return {
		restrict: 'A',
		require: ['form'],
		link: function (scope, element, attrs, ctrls) {
			scope.$watch.
			debugger;
			element.find('input').on('change', function (event) {
				EventBus.dispatch('form:updated', this, element);
			});
			element.find('select').on('change', function (event) {
				EventBus.dispatch('form:updated', this, element);
			});
		},
		scope: true
	};
}