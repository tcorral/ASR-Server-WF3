class FormService {
    constructor($window, $http, $q, configEnv, context, mailbox) {
        this.$window = $window;
        this.$http = $http;
        this.$q = $q;
        this.context = context;
        this.mailbox = mailbox;
        this.config = configEnv;
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
}
export default {
    FormService
}
