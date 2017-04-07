import RepeatSectionController from '../controllers/RepeatSectionController';
import typeaheadTemplate from '../templates/typeahead.html!text';
import repeatSectionTemplate from '../templates/repeatSection.html!text';

export default {
    typeahead: {
        name: 'typeahead',
        template: typeaheadTemplate,
        wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    },
    repeatSection: {
        name: 'repeatSection',
        template: repeatSectionTemplate,
        controller: RepeatSectionController
    },
    horizontalInput: {
        name: 'horizontalInput',
        extends: 'input',
        wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    },
    horizontalSelect: {
        name: 'horizontalSelect',
        extends: 'select',
        wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    },
    horizontalCheckbox: {
        name: 'horizontalCheckbox',
        extends: 'checkbox',
        wrapper: ['horizontalBootstrapRangeCheckbox', 'bootstrapHasError']
    },
    horizontalRange: {
        name: 'horizontalRange',
        extends: 'input',
        wrapper: ['horizontalBootstrapRangeLabel', 'bootstrapHasError']
    },
    horizontalRangeCheckbox: {
        name: 'horizontalRangeCheckbox',
        extends: 'checkbox',
        wrapper: ['horizontalBootstrapRangeLabel', 'bootstrapHasError']
    }
};