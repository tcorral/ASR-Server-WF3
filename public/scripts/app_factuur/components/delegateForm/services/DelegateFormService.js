import angular from "angular";

function getDataFromElements(params) {
    const oParams = {};
    for (let key in params) {
        if (params.hasOwnProperty(key) && params[key].name) {
            oParams[key] = {
                name: params[key].name,
                value: params[key].value
            };
        }
    }
    return oParams;
}
class DelegateFormService {
    constructor($q, $http, $filter, $location, ngToast, configEnv, mailbox, OTFormService) {
        this.$q = $q;
        this.$http = $http;
        this.$filter = $filter;
        this.$location = $location;
        this.ngToast = ngToast;
        this.config = configEnv;
        this.mailbox = mailbox;
        this.OTFormService = OTFormService;
    }

    getUrlParams() {
        return this.$location.search();
    }

    getMailbox() {
        const deferred = this.$q.defer();
        deferred.resolve(this.mailbox);
        return deferred.promise;
    }

    getPracticionersGroup(query) {
        return this
            .$http({
                method: 'GET',
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

    finalizeTask() {
        const formData = this.OTFormService.getFormData();
        const urlParams = this.$location.search();
        let processingURL = urlParams.nexturl.split('&');
        processingURL[6] = 'nexturl=' + this.config.scriptHome + 'OK.txt';
        let newNextURL = processingURL.join('&');

        return this
            .$http({
                method: 'GET',
                url: newNextURL,
                data: formData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function () {
                return urlParams;
            });
    }
	
	cancelAssignment(comments) {
        const deferred = this.$q.defer();
        const data = this.OTFormService.getData();
        let postbus = data.Postbus || '';
        const groep = postbus.toUpperCase() + '-Postverdeling';
        data.DelegateToUserName = data.DelegateToUserSavedName = groep;
        data.Opmerkingen = comments || '';
        this
            .getPracticionersGroup(groep)
            .then((res) => {
                data.DelegateToUserID = res[0].value;
                this
                    .delegate()
                    .then(() => {
                        this
                            .finalizeTask()
                            .then((urlParams) => {
                                deferred.resolve(urlParams);
                            });
                    });
            });

        return deferred.promise;
    }

    cancelWorkflow() {
        const deferred = this.$q.defer();
        const data = this.OTFormService.getData();
        let postbus = data.Postbus;
        if(postbus === "[LL_FormTag_1_1_28_1 /]") { // only for demo locally, it has no impact in production
            postbus = '';
        }
        const groep = postbus.toUpperCase() + '-Postverdeling';
        data.DelegateToUserName = data.DelegateToUserSavedName = groep;
        this
            .getPracticionersGroup(groep)
            .then((res) => {
                data.DelegateToUserID = res[0].value;
                this.ngToast.create(this.$filter('translate')('Command is canceled'));
                this
                    .delegate(true)
                    .then(() => {
                        this
                            .finalizeTask()
                            .then((urlParams) => {
                                deferred.resolve(urlParams);
                            });
                    });
            });

        return deferred.promise;
    }

    delegate(cancel) {
        const data = this.OTFormService.getData();
        delete data.loops[0].rngDelete;
        delete data.loops[0].followUp;
        data.nextStep = cancel ? 'annuleren' : 'delegate';
        const oFormData = this.OTFormService.getFormData();
		var formData = new FormData();
        var keys = Object.keys(oFormData);
        keys.forEach(function (key) {
            formData.append(key, oFormData[key]);
        });
		return this
                .$http
                .post(this.config.cgiUrlPrefix, formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
    }

    delegateWorkflow(delegate, partitionersGroup, postbus, comments) {
        const deferred = this.$q.defer();
        const data = this.OTFormService.getData();
        if (delegate && delegate.value) {
            data.DelegateToUserName = data.DelegateToUserSavedName = delegate.name;
            data.DelegateToUserID = delegate.value;
        } else {
            data.DelegateToUserName = data.DelegateToUserSavedName = partitionersGroup.name;
            data.DelegateToUserID = partitionersGroup.value;
            data.Postbus = postbus.value;
        }
        data.Opmerkingen = comments || '';
        
        this
            .delegate()
            .then(() => {
                this
                    .finalizeTask()
                    .then((urlParams) => {
                        deferred.resolve(urlParams);
                    });
            })

        return deferred.promise;
    }

    acceptAssignment() {
        const data = this.OTFormService.getData();
        data.AcceptAssignmentCurrentUserFullName = data.AcceptAssignmentCurrentUserSavedFullName = window.currentUserFullName;
        data.AcceptAssignmentCurrentUserId = window.currentUserId;
        const formData = this.OTFormService.getFormData();

        return this
            .$http({
                method: 'POST',
                url: this.config.cgiUrlPrefix,
                data: formData,
            });
    }
}

export default DelegateFormService;
