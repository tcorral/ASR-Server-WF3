System.config({
    baseURL: "/img/cgcustom/workflows/ASRFormFactuur/",
    defaultJSExtensions: true,
    transpiler: "babel",
    babelOptions: {
        "optional": [
            "runtime",
            "optimisation.modules.system"
        ]
    },
    paths: {
        "github:*": "jspm_packages/github/*",
        "npm:*": "jspm_packages/npm/*",
        "bower:*": "jspm_packages/bower/*",
        "app/*": "scripts/app/*"
    },

    map: {
        "angular": "github:angular/bower-angular@1.6.4",
        "angular-bootstrap": "github:angular-ui/bootstrap-bower@2.5.0",
        "angular-sanitize": "github:angular/bower-angular-sanitize@1.6.4",
        "angular-translate": "github:angular-translate/bower-angular-translate@2.15.1",
        "babel": "npm:babel-core@5.8.38",
        "babel-runtime": "npm:babel-runtime@5.8.38",
        "bootstrap": "bower:bootstrap@3.3.7",
        "core-js": "npm:core-js@1.2.7",
        "json": "github:systemjs/plugin-json@0.3.0",
        "krasimir/EventBus": "github:krasimir/EventBus@master",
        "mozilla/pdfjs-dist": "github:mozilla/pdfjs-dist@1.8.173",
        "tameraydin/ngToast": "github:tameraydin/ngToast@2.0.0",
        "text": "github:systemjs/plugin-text@0.0.9",
        "bower:bootstrap@3.3.7": {
            "jquery": "bower:jquery@3.2.1"
        },
        "github:angular-translate/bower-angular-translate@2.15.1": {
            "angular": "github:angular/bower-angular@1.6.4"
        },
        "github:angular/bower-angular-sanitize@1.6.4": {
            "angular": "github:angular/bower-angular@1.6.4"
        },
        "github:jspm/nodelibs-assert@0.1.0": {
            "assert": "npm:assert@1.4.1"
        },
        "github:jspm/nodelibs-buffer@0.1.0": {
            "buffer": "npm:buffer@3.6.0"
        },
        "github:jspm/nodelibs-path@0.1.0": {
            "path-browserify": "npm:path-browserify@0.0.0"
        },
        "github:jspm/nodelibs-process@0.1.2": {
            "process": "npm:process@0.11.9"
        },
        "github:jspm/nodelibs-util@0.1.0": {
            "util": "npm:util@0.10.3"
        },
        "github:jspm/nodelibs-vm@0.1.0": {
            "vm-browserify": "npm:vm-browserify@0.0.4"
        },
        "npm:assert@1.4.1": {
            "assert": "github:jspm/nodelibs-assert@0.1.0",
            "buffer": "github:jspm/nodelibs-buffer@0.1.0",
            "process": "github:jspm/nodelibs-process@0.1.2",
            "util": "npm:util@0.10.3"
        },
        "npm:babel-runtime@5.8.38": {
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:buffer@3.6.0": {
            "base64-js": "npm:base64-js@0.0.8",
            "child_process": "github:jspm/nodelibs-child_process@0.1.0",
            "fs": "github:jspm/nodelibs-fs@0.1.2",
            "ieee754": "npm:ieee754@1.1.8",
            "isarray": "npm:isarray@1.0.0",
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:core-js@1.2.7": {
            "fs": "github:jspm/nodelibs-fs@0.1.2",
            "path": "github:jspm/nodelibs-path@0.1.0",
            "process": "github:jspm/nodelibs-process@0.1.2",
            "systemjs-json": "github:systemjs/plugin-json@0.1.2"
        },
        "npm:inherits@2.0.1": {
            "util": "github:jspm/nodelibs-util@0.1.0"
        },
        "npm:path-browserify@0.0.0": {
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:process@0.11.9": {
            "assert": "github:jspm/nodelibs-assert@0.1.0",
            "fs": "github:jspm/nodelibs-fs@0.1.2",
            "vm": "github:jspm/nodelibs-vm@0.1.0"
        },
        "npm:util@0.10.3": {
            "inherits": "npm:inherits@2.0.1",
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:vm-browserify@0.0.4": {
            "indexof": "npm:indexof@0.0.1"
        }
    }
});
