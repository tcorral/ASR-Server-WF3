import angular from "angular";

class FeatureFormService {
    constructor($q, $http, configEnv, $location, OTFormService, DelegateFormService) {
        this.$q = $q;
        this.$http = $http;
        this.config = configEnv;
        this.$location = $location;
        this.OTFormService = OTFormService;
        this.DelegateFormService = DelegateFormService;
    }

    saveForm() {
        var oFormData = this.OTFormService.getFormData();
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
    
    validateOrSaveAndFinish() {
        var deferred = this.$q.defer();
        
        this
            .saveForm()
            .then((response) => {
                this
                    .DelegateFormService
                    .finalizeTask()
                    .then(function (urlParams) {
                        deferred.resolve(urlParams);
                    });
            });
        return deferred.promise;
	}
}

export default FeatureFormService;
