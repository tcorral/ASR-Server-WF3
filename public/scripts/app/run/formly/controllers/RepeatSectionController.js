function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getAddRandomIds() {
    var unique = 1;
    return function addRandomIds(fields) {
        unique++;
        fields.forEach(function (field, index) {
            if (field.fieldGroup) {
                return addRandomIds(field.fieldGroup);
            }
            if (field.templateOptions && field.templateOptions.fields) {
                addRandomIds(field.templateOptions.fields);
            }
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
        });
    }
}

function pageCheck(input, maxpages) {
    if (input < maxpages) {
        return input + 1;
    } else {
        return maxpages
    }
}
function copyFields(_fields) {
    var fields = _fields.concat({});
    var addRandomIds = getAddRandomIds();
    addRandomIds(fields);
    return fields;
}

class RepeatSectionController {
    constructor() {
        var ctrl = this;
        var maxpages = 1;

        ctrl.formOptions = {
            formState: ctrl.formState
        };
        ctrl.copyFields = copyFields;
        ctrl.addEmptyRange = function (input) {
            ctrl.model[ctrl.options.key].push({
                rangefrom: pageCheck(input.rangeto, maxpages),
                rangeto: maxpages,
                documentname: new Date().toISOString().substring(0, 10).replace("-", "").replace("-", "") + " testdocument",
                followup: true,
                workflowtype: false,
                followupdays: 7
            })
        };
        ctrl.copyRange = function(input) {
            ctrl.model[ctrl.options.key].push(angular.copy(input));
        };
        ctrl.deleteRange = function (input) {
            //due to reverse order, reverse $index
            var index = ctrl.model[ctrl.options.key].length-input-1;
            //take the range out the array
            ctrl.model[ctrl.options.key].splice(index,1);
        };
    }
}

export default RepeatSectionController;