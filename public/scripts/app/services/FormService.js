class FormService {
    constructor($window, $http, $q, devConfig, context, postBus) {
        this.$window = $window;
        this.$http = $http;
        this.$q = $q;
        this.context = context;
        this.postBus = postBus;
        this.config = devConfig;
        this.hideSection = false;
    }

    getContext() {
        const context = this.context;
        let taskid = '';
        let searchElements;
        let contextName;
        let i;
        if(this.$window.location.search) {
            searchElements =  this.$window.location.search.match(/taskid=([^&]*)/);
            taskid = searchElements.length > 1 ? searchElements[1] : '';
        }

        for (i = 0; i < context.length; i++) {
            if (context[i].value.toString() === taskid) {
                contextName = context[i].name;
                break;
            }
        }

        return contextName;
    }

    getPostBus() {
        const deferred = this.$q.defer();
        deferred.resolve(this.postBus);
        return deferred.promise;
    }

    getBehandelaarsgroep(query) {
        return this
            .$http({
                url: '', /*This is empty because we are pinging current url*/
                params: {
                    func: 'll',
                    objId: this.config.getgroup,
                    filter: query,
                    objAction: 'RunReport'
                }
            })
            .then(function (response) {
                const array = [];
                let i;
                let row;
                if (response.data.myRows) {
                    for (i = 0; i < response.data.myRows.length; i++) {
                        row = response.data.myRows[i];
                        array.push({
                            name: row.Name,
                            value: row.ID
                        });
                    }
                }

                return array;
            });
    }

    getSapObjectOptions() {
        return this
            .$http({
                url: '', /*This is empty on purpose because we are pinging current url*/
                params: {
                    func: 'll',
                    objId: this.config.getsapobjects,
                    objAction: 'RunReport'
                }
            })
            .then(function (response) {
                const array = [];
                let i;
                let row;
                if (response.data.myRows) {
                    for (i = 0; i < response.data.myRows.length; i++) {
                        row = response.data.myRows[i];
                        array.push({
                            name: row.Name,
                            value: row.Name
                        });
                    }
                }
                return array;
            });
    }

    getBusinessWorkspace(query, query2) {
        return this
            .$http({
                url: '', /*This is empty on purpose because we are pinging current url*/
                params: {
                    func: 'll',
                    objId: this.config.getbusinessworkspace,
                    filter: query,
                    filter2: query2,
                    objAction: 'RunReport'
                }
            })
            .then(function (response) {
                const array = [];
                let i;
                let row;
                if (response.data.myRows) {
                    for (i = 0; i < response.data.myRows.length; i++) {
                        row = response.data.myRows[i];
                        array.push({
                            name: row.Name,
                            value: row.DataID
                        });
                    }
                }
                return array;
            });
    }

    // Map Naam: returns a promise with select options
    getDocTypeGroup(query) {
        return this
            .$http({
                url: '', /*This is empty on purpose because we are pinging current url*/
                params: {
                    func: 'll',
                    objId: this.config.getdocumentgroups,
                    filter: query,
                    objAction: 'RunReport'
                }
            })
            .then(function (response) {
                const array = [];
                let i;
                let row;
                if (response.data.myRows) {
                    for (i = 0; i < response.data.myRows.length; i++) {
                        row = response.data.myRows[i];
                        array.push({
                            name: row.Name,
                            value: row.Name
                        });
                    }
                }
                return array;
            });
    }

    // Document Type: returns a promise with select options
    getDocType(query, query2) {
        return this
            .$http({
                url: '', /*This is empty on purpose because we are pinging current url*/
                params: {
                    func: 'll',
                    objId: this.config.getdocumenttypes,
                    filter: query,
                    filter2: encodeURIComponent(query2),
                    objAction: 'RunReport'
                }
            })
            .then(function (response) {
                const array = [];
                let i;
                let row;
                if (response.data.myRows) {
                    for (i = 0; i < response.data.myRows.length; i++) {
                        row = response.data.myRows[i];
                        array.push({
                            name: row.Name,
                            value: row.Name
                        })
                    }
                }
                return array;
            });
    }

    getUserByLogin(login) {
        return this
            .$http({
                url: '', /*This is empty on purpose because we are pinging current url*/
                params: {
                    func: 'll',
                    objId: this.config.userByLoginService,
                    login: login,
                    objAction: 'RunReport'
                }
            })
            .then(function (response) {
                let user;
                let transformedUser;
                if (response.data.myRows) {
                    user = response.data.myRows[0];
                    transformedUser = {
                        name: user.FirstName + ' ' + user.LastName + ' (' + user.Name + ')',
                        value: user.ID
                    };
                }
                return transformedUser;
            });
    }

    asyncFindUser(query) {
        return this
            .$http({
                url: '', /*This is empty on purpose because we are pinging current url*/
                params: {
                    func: 'll',
                    objId: this.config.autocompleteUsernameService,
                    filter: '%25' + query + '%25',
                    objAction: 'RunReport'
                }
            })
            .then(function (response) {
                const array = [];
                let i;
                let row;
                if (response.data.myRows) {
                    for (i = 0; i < response.data.myRows.length; i++) {
                        row = response.data.myRows[i];
                        array.push({
                            name: row.FirstName + " " + row.LastName + " (" + row.Name + ")",
                            value: row.ID
                        });
                    }
                }
                return array;
            });
    }
}
export default {
    FormService
}