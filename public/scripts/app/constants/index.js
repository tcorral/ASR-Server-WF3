import Events from 'krasimir/EventBus';

function getConfigEnvironment(environments) {
  var subdomain = window.document.location.host.replace(/^www\./,'').split(/([\.\:])/);
  return configs[environments[subdomain]]|| configs['dev'];
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

const otMapping = {
  dev: {
    '_1_1_31_1': function(config) {
      return config.settings.opmerkingen;
    },
    '_1_1_23_1': function (form, params, config) {
      return '';
    },
    'LL_FUNC_VALUES': function (config) {
      var funcValues = config.params['LL_FUNC_VALUES'];
      var split = funcValues.value.split(',');
      return split[7] = "'LL_NextURL'='" + config.scriptHome +"/OK.txt'";
    },
    'repeat': {
      '_1_1_8_{{index}}_9_1': function(config) {
        return (config.form.documentNaam || '');
      },
      '_1_1_8_{{index}}_10_1': function(form, params, config) {
        return ((form.rangeStart || 0) + '-' + (form.rangeEnd || 0));
      },
      '_1_1_8_{{index}}_12_1': function(form, params, config) {
        return (form.factuur ? 'Factuur' : 'Post');
      },
      '_1_1_8_{{index}}_13_1': function(form, params, config) {
        return (form.omschrijving || '')
      },
      '_1_1_8_{{index}}_14_1': function(form, params, config) {
        return 1;
      },
      '_1_1_8_{{index}}_14_1_Exists': function(form, params, config) {
        return 1;
      },
      '_1_1_8_{{index}}_15_1': function(form, params, config) {
        return (form.businessWorkspace ? form.businessWorkspace.value : '');
      },
      '_1_1_8_{{index}}_16_1': function(form, params, config) {
        return (form.workspaceCategory || '');
      },
      '_1_1_8_{{index}}_17_1': function(form, params, config) {
        return (form.documentType || '');
      },
      '_1_1_8_{{index}}_22_1': function(form, params, config) {
        return (form.mapName || '');
      },
      '_1_1_8_{{index}}_36_1': function(form, params, config) {
        return (form.docTypeGroupValue || '');
      },
      '_1_1_8_{{index}}_18_1': function(form, params, config) {
        return (form.followUp);
      },
      '_1_1_8_{{index}}_19_1_Name': function(form, params, config) {
        return (form.behandelaar ? form.behandelaar.name : '');
      },
      '_1_1_8_{{index}}_19_1_SavedName': function(form, params, config) {
        return (form.behandelaar ? form.behandelaar.name : '');
      },
      '_1_1_8_{{index}}_19_1_ID': function(form, params, config) {
        return (form.behandelaar ? form.behandelaar.value : '');
      },
      '_1_1_8_{{index}}_20_1': function(form, params, config) {
        return '1';
      },
      '_1_1_8_{{index}}_26_1': function(form, params, config) {
        return (form.followUpBinnen || '');
      },
      '_1_1_8_{{index}}_33_1': function(form, params, config) {
        return (form.followUpBeschrijving || '');
      },
      '_1_1_8_{{index}}_35_1': function (form, params, config) {

      }
    }
  },
  acc: {
    '_1_1_31_1': function(form) {

    },
    '_1_1_8_{{index}}_9_1': function(form) {
      return 1;
    },
    '_1_1_8_{{index}}_10_1': function(form) {
      return ((form.rangeStart || 0) + '-' + (form.rangeEnd || 0));
    },
    '_1_1_8_{{index}}_12_1': function(form) {
      return (form.factuur ? 'Factuur' : 'Post');
    },
    '_1_1_8_{{index}}_13_1': function(form) {
      return (form.omschrijving || '')
    },
    '_1_1_8_{{index}}_14_1': function(form) {
      return 1;
    },
    '_1_1_8_{{index}}_14_1_Exists': function(form) {
      return 1;
    },
    '_1_1_8_{{index}}_15_1': function(form) {

    },
    '_1_1_8_{{index}}_16_1': function(form) {
      return (form.workspaceCategory || '');
    },
    '_1_1_8_{{index}}_17_1': function(form) {
      return (form.documentType || '');
    },
    '_1_1_8_{{index}}_22_1': function(form) {
      return (form.mapName || '');
    },
    '_1_1_8_{{index}}_36_1': function(form) {
      return (form.docTypeGroupValue || '');
    },
    '_1_1_8_{{index}}_18_1': function(form) {
      return (form.followUp);
    },
    '_1_1_8_{{index}}_19_1_Name': function(form) {
      return (form.behandelaar ? form.behandelaar.name : '');
    },
    '_1_1_8_{{index}}_19_1_SavedName': function(form) {
      return (form.behandelaar ? form.behandelaar.name : '');
    },
    '_1_1_8_{{index}}_19_1_ID': function(form) {
      return (form.behandelaar ? form.behandelaar.value : '');
    },
    '_1_1_8_{{index}}_20_1': function(form) {
      return '1';
    },
    '_1_1_8_{{index}}_26_1': function(form) {
      return (form.followUpBinnen || '');
    },
    '_1_1_8_{{index}}_33_1': function(form) {
      return (form.followUpBeschrijving || '');
    },
    '_1_1_8_{{index}}_35_1': function (form) {

    },
    'LL_FUNC_VALUES': function (form) {

    },
    '_1_1_23_1': function (form) {
      return '';
    }
  },
  pro: {
    '_1_1_31_1': function(form) {

    },
    '_1_1_8_{{index}}_9_1': function(form) {
      return 1;
    },
    '_1_1_8_{{index}}_10_1': function(form) {
      return ((form.rangeStart || 0) + '-' + (form.rangeEnd || 0));
    },
    '_1_1_8_{{index}}_12_1': function(form) {
      return (form.factuur ? 'Factuur' : 'Post');
    },
    '_1_1_8_{{index}}_13_1': function(form) {
      return (form.omschrijving || '')
    },
    '_1_1_8_{{index}}_14_1': function(form) {
      return 1;
    },
    '_1_1_8_{{index}}_14_1_Exists': function(form) {
      return 1;
    },
    '_1_1_8_{{index}}_15_1': function(form) {

    },
    '_1_1_8_{{index}}_16_1': function(form) {
      return (form.workspaceCategory || '');
    },
    '_1_1_8_{{index}}_17_1': function(form) {
      return (form.documentType || '');
    },
    '_1_1_8_{{index}}_22_1': function(form) {
      return (form.mapName || '');
    },
    '_1_1_8_{{index}}_36_1': function(form) {
      return (form.docTypeGroupValue || '');
    },
    '_1_1_8_{{index}}_18_1': function(form) {
      return (form.followUp);
    },
    '_1_1_8_{{index}}_19_1_Name': function(form) {
      return (form.behandelaar ? form.behandelaar.name : '');
    },
    '_1_1_8_{{index}}_19_1_SavedName': function(form) {
      return (form.behandelaar ? form.behandelaar.name : '');
    },
    '_1_1_8_{{index}}_19_1_ID': function(form) {
      return (form.behandelaar ? form.behandelaar.value : '');
    },
    '_1_1_8_{{index}}_20_1': function(form) {
      return '1';
    },
    '_1_1_8_{{index}}_26_1': function(form) {
      return (form.followUpBinnen || '');
    },
    '_1_1_8_{{index}}_33_1': function(form) {
      return (form.followUpBeschrijving || '');
    },
    '_1_1_8_{{index}}_35_1': function (form) {

    },
    'LL_FUNC_VALUES': function (form) {

    },
    '_1_1_23_1': function (form) {
      return '';
    }
  }
};

export default {
  workflowtypeOptions,
  configEnv: getConfigEnvironment(environments),
  context,
  mailbox,
  otMapping,
  Events
}
