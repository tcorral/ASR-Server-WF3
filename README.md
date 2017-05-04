# Open Text ASR Workflow Local Development environment
----------------------------------------------------------

In this tool Blue Harvest &0169; team has worked hard to create:
* A local development environment to don't need to relay in real server for everything using Express and Node.js
* A kind of framework that uses Angular and configurations to make more easy to create new frontend for OT workflows.

## Dependencies:
1. [NodeJS](http://nodejs.org) > 0.12.X
2. [NPM](https://www.npmjs.com) > 3.X
3. [JSPM](http://jspm.io/) > 0.16.X

## Get Started
### Clone this repository:
```
git clone https://github.com/tcorral/ASR-Server-WF3.git
```
### Navigate into the folder created by git
```
cd ASR-Server-WF3
```
### Install NPM dependencies
```
npm install
```
### Execute server
```
npm start
```

## How OpenText works in the frontend?
OpenText frameworks generates a basic HTML, with the form on it, but the OpenText style is not very nice and usable for a regular user. OpenText generated form HTML contains a set of labels than on being parsed by OpenText server will be replaced with the correct data.

For instance ```[LL_UserFirstName /]``` will be replaced by ```Tomas``` in my case.

OpenText also uses another kind of label to add a set of possible datas, this label has the following structure.

```[LL_LOOP_BEGIN_X_X_X /] .... [LL_LOOP_END_X_X_X /]``` 

* **_X_X_X** on each loop will have a different value, normally each **X** will be a different number.
* Everything inside those two labels will be treated as an array item.
* The field names inside those two labels will not be the final names they will have or require on saving.

For instance...

```xml
<input type="hidden" name="_1_1_6_7_1" title="rngDocumentName" value="[LL_FormTag_1_1_6_7_1 /]">
```

if there is only one item it will be converted to something like...

```xml
<input type="hidden" name="_1_1_6_1_7_1" title="rngDocumentName" value="[LL_FormTag_1_1_6_7_1 /]">
```

### The frontend requires:

1. You to get the form HTML code from OpenText.
2. Create an HTML page with your dependencies and with the form before the body closing tag.
2. Add a title to each field in this form.
3. Add a configuration mapping object to get this data from the form. OTFormService uses the title to get the input values and store it.
4. Add a configuration mapping object to set this data as a Form Data object that will be sent to the server in order to save the changes in the forms.
5. Add a configuration per environment to set all the objId used in OpenText to fetch the data.

### How this framework works?

#### Dependencies

* [Bootstrap](http://getbootstrap.com/) as CSS framework.
* [AngularJS](https://angularjs.org/) as the main frontend framework.
* [JSPM](http://jspm.io/) as package manager and bundling tool.
* [JSPM plubin text](https://github.com/systemjs/plugin-text) used to include the templates in the final code.
* [SystemJS](https://github.com/systemjs/systemjs) as lazy loader tool.
* [ES6 a.k.a ES2015](https://babeljs.io/learn-es2015/) as the main language.
* [Babel](https://babeljs.io) as ES6 to ES5 transpiler.

#### Basic structure:

* jspm_packages
    * Contains all the vendor libraries installed using JSPM
* partials
    * Contains the main AngularJS layout template.
* scripts
    * Contains all the scripts used in the app/workflow.
* styles
    * Contains all the style rules to tweak or style your app/workflow on top of Bootstrap.
* vendor
    * Contains a fixed version of pdf.js
* config.js
    * SystemJS configuration.
* index.html
    * The main file where the OT form should be added together with your dependencies.
* OK.txt
    * This file is required because OT wants to return to an specific page on saving.

#### OT Framework structure:
The OT framework components can be found inside *scripts/app* folder.

* components
    * Contains the basic components used in the main Angular template.
* config
    * Contains the config function that will executed on setting up the Angular module.
* constants
    * Contains some constants and configuration data.
* controllers
    * The basic controllers used/required in the main Angular template.
* i18n
    * Contains one file, with a set of key and value pairs, per language used by [ngTranslate](https://angular-translate.github.io/) 
* services
    * Contains the common services used in the app.
* utils
    * Contains some common util functions used across the framework.
* index.js
    * Is the bootstrap file that loads the module with all the dependencies.

#### How the code is structured?
A few many times we find Angular apps that are structured in a flat way where all the components are in the same folder even if they are depending on or dependant from other components.
The best way to work with Angular is to keep everything inside it's context and this is how our components code is structured.

An example of a simple component is **delegateForm**, you can find it in **scripts/app/components/delegateForm**, once you open the containing folder you can see that it contains the following:

* controllers
    * Contains the controllers used in this component.
* services
    * Contains the services used in this component.
* templates
    * Angular template used in this component.
* index.js
    * Is the main javascript file used to configure the component.

An example of a component with multiple component dependencies is **featureForm**, you can find it in **scripts/app/components/featureForm**, once you open the containing folder you can see that it contains the following:

* components
    * Contains other components that are required by **featureForm**
* controllers
    * Contains the controllers used in this component.
* services
    * Contains the services used in this component.
* templates
    * Angular template used in this component.

The pattern should be followed to be able to move/copy a component with all its dependencies.

#### How to export my component?
Exporting your component should follow a simple pattern so the main app file can read it and download not only the component but also all the other required depencies like services and other components.

The following line of code in **scripts/app/index.js** that the job of loading it for you.

```javascript
utils.addComponentsRecursive(formAppModule, [delegateFormComponent, featureFormComponent]);
```

This function only requires two arguments:
* The variable name of the Angular module where the component and dependencies will be aggregated.
* The array of basic components required in the Angular main template.

To make this work properly you as a developer should follow an specific pattern on exporting your component:
(You can see one example in **scripts/app/components/featureForm/index.js**)

```javascript
export default {
    component: {                      // Main component object
        name: 'featureForm',          // Component name that will be used as an HTML tag replacing camel case by snake case
        component: {                  // Regular component object (https://docs.angularjs.org/guide/component)
            template: template,
            controller: FeatureFormController,
            bindings: {
                display: "="
            }
        },
        subcomponents: [              // Components array required in the current component
            unselectedPagesFormComponent,
            documentsFormComponent,
            closeModalComponent
        ],
        services: { FeatureFormService }    // Services object with one service per key.
    }
};
```

#### Remarkable point about OT Framework

* Exported items are plain Javascript objects, classes or functions so that moving code from the current framework to a different one could be done very easily.
* Only one Angular bootstrapping file.
* Uses explicit dependency injection to avoid problems on minification and to keep the code isolated of the usage of Angular.
* Configuration manages:
    * How to get and set data from and to OpenText.
    * Object ids to be used as specific endpoints.





