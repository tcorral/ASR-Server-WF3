import Events from 'krasimir/EventBus';

function getConfigEnvironment(environments) {
  var subdomain = window.document.location.host.replace(/^www\./,'').split(/([\.\:])/);
  return configs[environments[subdomain]]|| configs['dev'];
}

function addZeros(value) {
  if(value < 10) {
    return '0' + value;
  }
  return value;
}

function getMonth(date) {
  var month = date.getMonth() + 1;
  return addZeros(month);
}
function getDate(date) {
  var date = date.getDate();
  return addZeros(date);
}
function getFormattedDate(date) {
  return getMonth(date) + '/' + getDate(date) + '/' + date.getFullYear();
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
    func: function (value) {
      var parts = value.split(',');
      parts[7] = "'LL_NextURL'='/img/cgcustom/workflows/ASRFormKenmerken/OK.txt'"
      return parts.join(',');
    }
  },
  loop: {
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
    Opmerkingen: function (input) {
      return input.value;
    },
    AcceptAssignmentCurrentUserFullName: function (input) {
      return input.value;
    },
    AcceptAssignmentCurrentUserId: function (input) {
      return input.value;
    },
    func: function (input) {
      return input.value;
    }
  },
  loop: {
    rngDocumentName: function (input) {
      return input.value || '';
    },
    rngRange: function (input) {
      var rangeParts = input.value.split('-');
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
    rngOmschrijving: function (input) {
      return input.value;
    },
    rngBusinessWorkspace: function (input){
      return {
        name: '',
        value: input.value
      };
    },
    rngSapObject: function (input) {
      return input.value;
    },
    rngDocumenttype: function (input) {
      return input.value;
    },
    rngDocumenttypeGroep: function (input) {
      return input.value;
    },
    rngFolderID: function (input) {
      return input.value;
    },
    rngBehandelaarID: function (input) {
      return input.value;
    },
    rngBehandelaarName: function (input){
      return input.value;
    },
    followUp: function (input) {
      return input.checked;
    },
    rngFollowupDays: function (input) {
      return parseInt(input.value, 10);
    },
    rngFolluwpDescription: function (input) {
      return input.value;
    },
    rngFollowUpDate: function (input) {
      return new Date((input.value || ''));
    }
  }
}


export default {
  workflowtypeOptions,
  configEnv: getConfigEnvironment(environments),
  context,
  mailbox,
  Events,
  otMappingGetter,
  otMappingSetter
}
