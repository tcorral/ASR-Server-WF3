class BusinessWorkspaceController {
    constructor($scope, FormService) {
        $scope.$watch('model.businessworkspace', function () {
            if ($scope.model.businessworkspace === undefined || $scope.model.businessworkspace.length < 4) {
                return console.log("returned");
            } else {
                FormService
                    .getBusinessWorkspace($scope.model.workspacecategory, $scope.model.businessworkspace)
                    .then(function (response) {
                        $scope.to.options = response;
                        return response;
                    });
            }
        })
    }
}

export default BusinessWorkspaceController;