import Events from 'krasimir/EventBus';

function getConfigEnvironment(environments) {
    const subdomain = (window.document.location.host.replace(/^www\./, '').split(/([\.\:])/))[0];
    return configs[environments[subdomain]] || configs['dev'];
}

function simpleInputGetter(input) {
    return input.value;
}

const speedtypeOptions = [
    {
        name: 'Nee',
        value: 'Nee'
    },
    {
        name: 'Ja',
        value: 'Ja'
    }
];

const workflowtypeOptions = [
    {
        name: "Factuur",
        value: "Factuur"
    },
    {
        name: "Post",
        value: "Post"
    }
];

const configs = {
    dev: {
        "otFormId": "llForm",
        "otDateFormat": "MM/dd/yyyy",
        "scriptHome": "/img/cgcustom/workflows/ASRFormFactuur/",
        "userByLoginService": 113696,
        "autocompleteUsernameService": 113694,
        "getworkflowattachmentService": 113689,
        "getsapobjects": 113692,
        "getdocumenttypes": 113690,
        "getdocumentgroups": 113693,
        "getbusinessworkspace": 7334381,
        "getbusinessworkspacename": 11280514,
        "getsubfolderid": 11200712,
        "getsubfolders": 11199172,
        "getexclusionpatterns": 11199569,
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
        "scriptHome": "/img/cgcustom/workflows/ASRFormFactuur/",
        "userByLoginService": 113696,
        "autocompleteUsernameService": 113694,
        "getworkflowattachmentService": 113689,
        "getsapobjects": 113692,
        "getdocumenttypes": 113690,
        "getdocumentgroups": 113693,
        "getbusinessworkspace": 7334381,
        "getbusinessworkspacename": 14520258,
        "getsubfolderid": 14473737,
        "getsubfolders": 14474719, /*11199172,*/
        "getexclusionpatterns": 14488971,
        "getgroup": 113695,
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
        "scriptHome": "/img/cgcustom/workflows/ASRFormFactuur/",
        "userByLoginService": 113696,
        "autocompleteUsernameService": 113694,
        "getworkflowattachmentService": 113689,
        "getsapobjects": 113692,
        "getdocumenttypes": 113690,
        "getdocumentgroups": 113693,
        "getbusinessworkspace": 7334381,
        "getbusinessworkspacename": 14520258,
        "getsubfolderid": 14473737,
        "getsubfolders": 11199172,
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
    }
};

const environments = {
    'OTA2153': 'dev',
	'xecm-acc': 'acc',
	'xecm-ot': 'dev',
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

const conditionalExcludeDataFields = {
    single: {},
    loop: {
        rngDelete: function (value) {
            return value === 1;
        }
    }
};
const otMappingSetter = {
    single: {
        LL_FUNC_VALUES: function (value) {
            const parts = value.split(',');
            parts[7] = "'LL_NextURL'='/img/cgcustom/workflows/ASRFormFactuur/OK.txt'"
            return parts.join(',');
        }
    },
    loop: {
        rngRange: function (range) {
            return range.rangeStart + '-' + range.rangeEnd;
        },
        rngDelete: function (value) {
            return Number(value);
        },
        rngWorkflowType: function (value) {
            return value ? 'Factuur' : 'Post';
        },
        rngBusinessWorkspace: function (businessWorkspace) {
            return (businessWorkspace && businessWorkspace.value);
        },
        rngBehandelaarID: function (obj, doc, index, documentsLength) {
            var selector = 'data-js-id-' + ((documentsLength - 1) - index);
			const behandelaarIdInput = document.querySelector('[' + selector + ']');
			let result = '';
            if(behandelaarIdInput && typeof obj !== 'object') {
                result = behandelaarIdInput.getAttribute(selector);
            } else if(typeof obj === 'object') {
				result = obj.value;
			} 
			return result;
        },
        rngBehandelaarName: function (value, document) {
            return document.rngBehandelaarID.name;
        }
    }
};

const otMappingGetter = {
    single: {
        LL_FUNC_VALUES: simpleInputGetter,
        LL_AttrFieldName: simpleInputGetter,
        LL_AttrFieldIndex: simpleInputGetter,
        LL_WFATTURL: simpleInputGetter,
        bevoegdheidsgroep: simpleInputGetter,
        workflowfactuurtype: simpleInputGetter,
        behandelaarID: simpleInputGetter,
        behandelaarName: simpleInputGetter,
        spoed: simpleInputGetter,
        nextstep: simpleInputGetter,
        gedelegeerdeID: simpleInputGetter,
        gedelegeerdeName: simpleInputGetter
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
        rngWorkflowType: simpleInputGetter,
        rngOmschrijving: simpleInputGetter,
        rngGoedkeuring: simpleInputGetter,
        rngBusinessWorkspace: function (input) {
            return {
                name: '',
                value: input.value
            };
        },
        rngBevoegdheidsgroep: simpleInputGetter,
        rngWorkflowFactuurtype: simpleInputGetter,
        rngBehandelaarID: function (input, index) {
			input.setAttribute('data-js-id-' + index, input.value);
			var behandelaarNameInput = document.querySelectorAll('[title="rngBehandelaarName"]')[index];
			return behandelaarNameInput.value;
		},
        rngBehandelaarName: simpleInputGetter,
        rngSpoed: simpleInputGetter,
        rngOntbrekendeStukken: simpleInputGetter,
        rngZakelijk: simpleInputGetter,
        rngControleVoorAf: simpleInputGetter,
        rngPostbus: simpleInputGetter
    }
}

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
    conditionalExcludeDataFields,
    speedtypeOptions,
    validationPatterns: {
        timestampPattern,
        docnamePattern,
        doctypePattern,
        behandelaarPattern
    }
}
