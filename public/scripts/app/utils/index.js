const utils = {
    getClearObjectData(obj) {
        let item;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                item = obj[key];
                if (Array.isArray(item)) {
                    item = [];
                } else if (typeof item === 'string') {
                    item = '';
                } else if (typeof item === 'number') {
                    item = 0;
                } else if (Object.prototype.toString.call(item) === "[object Date]") {
                    item = new Date();
                } else if (typeof item === 'object' && item !== null) {
                    item = utils.getClearObjectData(item);
                } else if (typeof item === 'boolean') {
                    item = false;
                }
                obj[key] = item;
            }
        }
        return obj;
    },
    getOTDateFormat(rawDate, $filter, config){
        let newDate = '';
        if (rawDate) { //acc 03/09/2017
            newDate = $filter('date')(rawDate, config.otDateFormat);
        }
        return newDate.toString();
    },
    addComponentsRecursive: function (appModule, components) {
        components.forEach(function (item) {
            const component = item.component;
            appModule.component(component.name, component.component);
            if (component.services) {
                appModule.service(component.services);
            }
            if (component.subcomponents) {
                utils.addComponentsRecursive(appModule, component.subcomponents);
            }
        });
    }
};

export default utils;
