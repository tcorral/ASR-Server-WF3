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

const devConfig = {
    "scriptHome": "/img/ASRFormKenmerken/",
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
};

const accConfig = {
    "scriptHome": "/img/ASRFormKenmerken/",
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
};

const prodConfig = {
    "scriptHome": "/img/ASRFormKenmerken/",
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
const postBus = [
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
    },
];

export default {
    workflowtypeOptions,
    devConfig,
    accConfig,
    prodConfig,
    context,
    postBus
}