import validationTemplate from '../templates/validation.html!text';
import horizontalLabelTemplate from '../templates/horizontalLabel.html!text';
import horizontalCheckboxTemplate from '../templates/horizontalCheckbox.html!text';
import horizontalRangeTemplate from '../templates/horizontalRange.html!text';

export default {
    validation: {
        name: 'validation',
        types: ['horizontalInput', 'horizontalSelect', 'checkbox','typeahead'],
        template: validationTemplate
    },
    horizontalBootstrapLabel: {
        name: 'horizontalBootstrapLabel',
        template: horizontalLabelTemplate
    },
    horizontalBootstrapRangeCheckbox: {
        name: 'horizontalBootstrapRangeCheckbox',
        template: horizontalCheckboxTemplate
    },
    horizontalBootstrapRangeLabel: {
        name: 'horizontalBootstrapRangeLabel',
        template: horizontalRangeTemplate
    },

}