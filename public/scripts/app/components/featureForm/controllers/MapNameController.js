class MapNameController {
    constructor($scope, FormService) {
        $scope.$watch('model.workspacecategory', function () {
            if ($scope.model.workspacecategory === undefined) {
                return console.log("returned");
            } else {
                FormService
                    .getDocTypeGroup($scope.model.workspacecategory)
                    .then(function (response) {
                        $scope.to.options = response;
                        return response;
                    });
            }
        })
    }
}

export default MapNameController;