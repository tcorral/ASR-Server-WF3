import Events from 'krasimir/EventBus';

function getConfigEnvironment(environments) {
    const subdomain = window.document.location.host.replace(/^www\./, '').split(/([\.\:])/);
    return configs[environments[subdomain]] || configs['dev'];
}

function addZeros(value) {
    if (value < 10) {
        return '0' + value;
    }
    return value;
}

function getMonth(date) {
    const month = date.getMonth() + 1;
    return addZeros(month);
}
function getDate(date) {
    const date = date.getDate();
    return addZeros(date);
}
function getFormattedDate(date) {
    return getMonth(date) + '/' + getDate(date) + '/' + date.getFullYear();
}

function simpleInputGetter(input) {
    return input.value;
}

const workflowtypeOptions = [
    {
        name: "Post",
        value: "post"
    },
    {
        name: "Factuur",
        value: "factuur"
    }
];

const configs = {
    dev: {
        "otFormId": "llForm",
        "otDateFormat": "MM/dd/yyyy",
        "scriptHome": "/img/cgcustom/workflows/ASRFormKenmerken/",
        "userByLoginService": 113696,
        "autocompleteUsernameService": 113694,
        "getworkflowattachmentService": 113689,
        "getsapobjects": 113692,
        "getdocumenttypes": 113690,
        "getdocumentgroups": 113693,
        "getbusinessworkspace": 7334381,
        "getbusinessworkspacename": 14520258,
        "getsubfolderid": 14473737,
        "getexclusionpatterns": 14488971,
        "getgroup": 113695,
        "cgiUrlPrefix": "/otcs/llisapi.dll",
        "csEmulation": false,
        "currentUserLogin": currentUserLogin,
        "currentUserFullName": currentUserFullName,
        "currentUserId": currentUserId,
        "attachFolder": "",
        "pdfjsViewerPath": "vendor/pdfjs/web/viewer.html",
        "pageLimit": 13
    },
    acc: {
        "otFormId": "llForm",
        "otDateFormat": "MM/dd/yyyy",
        "scriptHome": "/img/cgcustom/workflows/ASRFormKenmerken/",
        "userByLoginService": 200818,
        "autocompleteUsernameService": 200812,
        "getworkflowattachmentService": 200795,
        "getsapobjects": 200804,
        "getdocumenttypes": 200798,
        "getdocumentgroups": 200809,
        "getbusinessworkspace": 1626086,
        "getbusinessworkspacename": 14520258,
        "getsubfolderid": 14473737,
        "getexclusionpatterns": 14488971,
        "getgroup": 200815,
        "cgiUrlPrefix": "/otcs/llisapi.dll",
        "csEmulation": false,
        "currentUserLogin": currentUserLogin,
        "currentUserFullName": currentUserFullName,
        "currentUserId": currentUserLogin,
        "attachFolder": "",
        "pdfjsViewerPath": "vendor/pdfjs/web/viewer.html",
        "pageLimit": 13
    },
    prod: {
        "otFormId": "llForm",
        "otDateFormat": "MM/dd/yyyy",
        "scriptHome": "/img/cgcustom/workflows/ASRFormKenmerken/",
        "userByLoginService": 113696,
        "autocompleteUsernameService": 113694,
        "getworkflowattachmentService": 113689,
        "getsapobjects": 113692,
        "getdocumenttypes": 113690,
        "getdocumentgroups": 113693,
        "getbusinessworkspace": 7334381,
        "getbusinessworkspacename": 14520258,
        "getsubfolderid": 14473737,
        "": 14488971,
        "getgroup": 113695,
        "cgiUrlPrefix": "/otcs/llisapi.dll",
        "csEmulation": false,
        "currentUserLogin": currentUserLogin,
        "currentUserFullName": currentUserFullName,
        "currentUserId": currentUserId,
        "attachFolder": "",
        "pdfjsViewerPath": "vendor/pdfjs/web/viewer.html",
        "pageLimit": 13
    }
};

const environments = {
    'OTA2153': 'dev',
    'OTA2310': 'acc',
    'OTA2156': 'acc',
    'OTA2157': 'acc'
};

const context = [
    {
        name: "dispatch",
        value: 3
    },
    {
        name: "dispatch_delegate",
        value: 26
    },
    {
        name: "kenmerk",
        value: 7
    },
    {
        name: "kenmerk_delegate",
        value: 11
    }
];
const mailbox = [
    {
        value: "cog",
        name: "Commercieel Onroerendgoed"
    },
    {
        value: "won",
        name: "Woningen"
    },
    {
        value: "lan",
        name: "Landelijk"
    },
    {
        value: "cred",
        name: "Crediteuren"
    },
    {
        value: "alg",
        name: "Algemeen"
    }
];

const otMappingSetter = {
    single: {
        LL_FUNC_VALUES: function (value) {
            const parts = value.split(',');
            parts[7] = "'LL_NextURL'='/img/cgcustom/workflows/ASRFormKenmerken/OK.txt'"
            return parts.join(',');
        }
    },
    loop: {
        rngFolderID: function (value, document) {
            return value || document.rngDocumenttype;
        },
        rngWorkflowType: function (value) {
            return value ? 'Factuur' : 'Post';
        },
        rngRange: function (range) {
            return range.rangeStart + '-' + range.rangeEnd;
        },
        rngBusinessWorkspace: function (businessWorkspace) {
            return businessWorkspace.value;
        },
        rngFollowUpDate: function (date) {
            return getFormattedDate(date);
        }
    }
};
const otMappingGetter = {
    single: {
        LL_FUNC_VALUES: simpleInputGetter,
        LL_AttrFieldName: simpleInputGetter,
        LL_AttrFieldIndex: simpleInputGetter,
        LL_WFATTURL: simpleInputGetter,
        BusinessWorkspace: simpleInputGetter,
        SapObject: simpleInputGetter,
        DocumenttypeGroep: simpleInputGetter,
        DelegateToUserID: simpleInputGetter,
        Postbus: simpleInputGetter,
        FollowupType: simpleInputGetter,
        DelegateToUserSavedName: simpleInputGetter,
        DelegateToUserName: simpleInputGetter,
        Opmerkingen: simpleInputGetter,
        AcceptAssignmentCurrentUserSavedFullName: simpleInputGetter,
        AcceptAssignmentCurrentUserFullName: simpleInputGetter,
        AcceptAssignmentCurrentUserId: simpleInputGetter,
        DocumentType: simpleInputGetter,
        FollowupDays: simpleInputGetter,
        func: simpleInputGetter,
        HiddenId: simpleInputGetter,
        HiddenSavedName: simpleInputGetter,
        HiddenName: simpleInputGetter
    },
    loop: {
        rngDocumentName: function (input) {
            return input.value || '';
        },
        rngRange: function (input) {
            const rangeParts = input.value.split('-');
            return {
                rangeStart: parseInt(rangeParts[0], 10),
                rangeEnd: parseInt(rangeParts[1], 10)
            };
        },
        rngDelete: function (input) {
            return input.checked;
        },
        rngWorkflowType: function (input) {
            return input.value === 'Factuur';
        },
        rngOmschrijving: simpleInputGetter,
        rngBusinessWorkspace: function (input) {
            return {
                name: '',
                value: input.value
            };
        },
        nextStep: simpleInputGetter,
        rngFollowupType: simpleInputGetter,
        rngBehandelaarSavedName: simpleInputGetter,
        rngSapObject: simpleInputGetter,
        rngDocumenttype: simpleInputGetter,
        rngDocumenttypeGroep: simpleInputGetter,
        rngFolderID: simpleInputGetter,
        rngBehandelaarID: simpleInputGetter,
        rngBehandelaarName: simpleInputGetter,
        followUp: function (input) {
            return input.checked;
        },
        rngFollowupDays: function (input) {
            return parseInt(input.value, 10);
        },
        rngFolluwpDescription: simpleInputGetter,
        rngFollowUpDate: function (input) {
            return new Date((input.value || ''));
        }
    }
}

const followUpOptions = [{
    name: 'Direct',
    value: 2
    },{
    name: '7 Days',
    value: 7
    },{
    name: '14 Days',
    value: 14
    },{
    name: '28 Days',
    value: 28
}];

const timestampPattern = /^([0-9]{4}(0[1-9]|1[0-2])([0-2]{1}[0-9]{1}|3[0-1]{1}))$/;
const docnamePattern = /^[0-9a-zA-Z_\. ]*$/;
const doctypePattern = /^[0-9a-zA-Z_&\/\. ]*$/;
const behandelaarPattern = /^[0-9a-zA-Z_\-\(\)\S\s]*$/;

export default {
    workflowtypeOptions,
    configEnv: getConfigEnvironment(environments),
    context,
    mailbox,
    Events,
    otMappingGetter,
    otMappingSetter,
    followUpOptions,
    validationPatterns: {
        timestampPattern,
        docnamePattern,
        doctypePattern,
        behandelaarPattern
    }
}
