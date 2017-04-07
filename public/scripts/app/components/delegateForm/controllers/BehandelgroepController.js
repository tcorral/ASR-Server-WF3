class BehandelgroepController {
    constructor($scope, FormService) {
        $scope.$watch('model.postbus', () => {
            if (typeof $scope.model.postbus === 'undefined') {
                return console.log("returned");
            } else {
                FormService
                    .getBehandelaarsgroep($scope.model.postbus)
                    .then(function (response) {
                        $scope.to.options = response;
                    });
            }
        });
    }
}

export default BehandelgroepController;