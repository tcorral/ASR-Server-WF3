class BehandelaarController {
    constructor($scope, FormService, devConfig) {
        FormService
            .getUserByLogin(devConfig.currentUserLogin)
            .then(function (response) {
                $scope.model.behandelaar = response;
            });
        $scope.$watch('model.behandelaar', function () {
            if ($scope.model.behandelaar === undefined || $scope.model.behandelaar.length < 4) {
                return console.log("returned");
            } else {
                FormService
                    .asyncFindUser($scope.model.behandelaar)
                    .then(function (response) {
                        $scope.to.options = response;
                        return response
                    })
            }
        })
    }
}

export default BehandelaarController;