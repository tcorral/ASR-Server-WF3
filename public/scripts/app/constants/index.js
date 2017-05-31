import Events from 'krasimir/EventBus';
import angular from 'angular';
import Cookies from 'js-cookie';

const envs = ['dev', 'acc', 'prod'];
const commonConfig = {
    "otFormId": "llForm",
    "otDateFormat": "MM/dd/yyyy",
    "scriptHome": "/img/cgcustom/workflows/ASRFormKenmerken/",
    "cgiUrlPrefix": "/otcs/llisapi.dll",
    "csEmulation": false,
    "currentUserLogin": currentUserLogin,
    "currentUserFullName": currentUserFullName,
    "currentUserId": currentUserId,
    "attachFolder": "",
    "pdfjsViewerPath": "vendor/pdfjs/web/viewer.html",
    "pageLimit": 13
};

function requestObjId(config) {
    const url = config.url;
    const key = config.key;
    const objId = config.objId;
    const finalConfig = config.config;
    const iteration = config.iteration;
    const iterationsLength = config.iterationsLength;
    return $.ajax({
        async: false,
        method: 'GET',
        dataType: 'html',
        url: url,
        data: {
            func: 'll',
            objAction: 'RunReport',
            objId: objId
        },
        success: function (response) {
            response = typeof response === 'string' ? response : '';
            if(response.toLowerCase().indexOf('content server -') === -1) {
                finalConfig[key] = objId;
            } 
        }
    })
}

function getConfigEnvironment(commonConfig, configs, envs) {
    let config = angular.copy(commonConfig);
    const lenCommonConfigKeys = Object.keys(commonConfig).length;
    const iterationsLength = Object.keys(configs.dev).length;
    let iteration = 0;
    const asrConfig = Cookies.get('asr-env-config');
    const url = commonConfig.cgiUrlPrefix;
    const deferreds = [];
    if(asrConfig) {
        config = JSON.parse(asrConfig);
    } else {
        for(let index = 0, len = envs.length; index < len; index++) {
            let envConfig = configs[envs[index]];
            for(let key in envConfig) {
                if(envConfig.hasOwnProperty(key)) {
                    iteration++;
                    let objId = envConfig[key];
                    requestObjId({ 
                        url, 
                        key,
                        iteration,
                        iterationsLength,
                        objId, 
                        config});
                }
            }
        }
        console.log(config);
        if(Object.keys(config).length === lenCommonConfigKeys) {
            config = angular.extend(config, configs['dev']);
        }
        Cookies.set('asr-env-config', JSON.stringify(config));
    }

    return config;
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
        "getgroup": 113695
    },
    acc: {
        "userByLoginService": 113696,
        "autocompleteUsernameService": 113694,
        "getworkflowattachmentService": 113689,
        "getsapobjects": 113692,
        "getdocumenttypes": 113690,
        "getdocumentgroups": 113693,
        "getbusinessworkspace": 7334381,
        "getbusinessworkspacename": 14520258,
        "getsubfolderid": 14473737,
        "getsubfolders": 14474719, 
        "getexclusionpatterns": 14488971,
        "getgroup": 113695
    },
    prod: {
        "userByLoginService": 113696,
        "autocompleteUsernameService": 113694,
        "getworkflowattachmentService": 113689,
        "getsapobjects": 113692,
        "getdocumenttypes": 113690,
        "getdocumentgroups": 113693,
        "getbusinessworkspace": 7334381,
        "getbusinessworkspacename": 15566117,
        "getsubfolderid": 15570352,
        "getsubfolders": 15569905,
        "getexclusionpatterns": 15620016,
        "getgroup": 113695
    }
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
        followUp: function (value) {
            return value === 1;
        },
        rngDelete: function (value) {
            return value === 1;
        }
    }
};
const otMappingSetter = {
    single: {
        LL_FUNC_VALUES: function (value) {
            const parts = value.split(',');
            parts[7] = "'LL_NextURL'='/img/cgcustom/workflows/ASRFormKenmerken/OK.txt'"
            return parts.join(',');
        }
    },
    loop: {
		followUp: function (value) {
            return Number(value);
        },
        rngDelete: function (value) {
            return Number(value);
        },
        rngFolderID: function (value) {
            return Number(value || 0);
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
        },
        rngBehandelaarSavedName: function (value, doc) {
            return doc.rngBehandelaarID.name;
        },
        rngWorkflowType: function (value) {
            return value ? 'Factuur' : 'Post';
        },
        rngRange: function (range) {
            return range.rangeStart + '-' + range.rangeEnd;
        },
        rngBusinessWorkspace: function (businessWorkspace) {
            return (businessWorkspace && businessWorkspace.value);
        },
        rngFollowUpDate: function (date) {
            return '[object OTDate]';
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
        HiddenName: simpleInputGetter,
        nextStep: simpleInputGetter
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
        followUp: function (input) {
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
        rngFollowupType: simpleInputGetter,
        rngSapObject: simpleInputGetter,
        rngDocumenttype: simpleInputGetter,
        rngDocumenttypeGroep: simpleInputGetter,
        rngFolderID: simpleInputGetter,
        rngBehandelaarID: function (input, index) {
			input.setAttribute('data-js-id-' + index, input.value);
			var behandelaarNameInput = document.querySelectorAll('[title="rngBehandelaarName"]')[index];
			return behandelaarNameInput.value;
		},
        rngBehandelaarName: simpleInputGetter,
		rngBehandelaarSavedName: simpleInputGetter,
        rngFollowupDays: function (input) {
            return parseInt((input.value || 0), 10)
        },
        rngFolluwpDescription: simpleInputGetter,
        rngFollowUpDate: function (input) {
            let date = new Date(input.value);
            if(!input.value) {
                date = new Date();
            }
            return date;
        }
    }
}

const followUpOptions = [{
    name: 'Direct',
    value: 2
    },{
    name: '7 days',
    value: 7
    },{
    name: '14 days',
    value: 14
    },{
    name: '28 days',
    value: 28
}];

const timestampPattern = /^([0-9]{4}(0[1-9]|1[0-2])([0-2]{1}[0-9]{1}|3[0-1]{1}))$/;
const docnamePattern = /^[0-9a-zA-Z_\. ]*$/;
const doctypePattern = /^[0-9a-zA-Z_&\/\. ]*$/;
const behandelaarPattern = /^[0-9a-zA-Z_\-\(\)\S\s]*$/;

export default {
    workflowtypeOptions,
    configEnv: getConfigEnvironment(commonConfig, configs, envs),
    context,
    mailbox,
    Events,
    otMappingGetter,
    otMappingSetter,
    conditionalExcludeDataFields,
    followUpOptions,
    validationPatterns: {
        timestampPattern,
        docnamePattern,
        doctypePattern,
        behandelaarPattern
    }
};
