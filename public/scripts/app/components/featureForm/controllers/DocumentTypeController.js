class DocumentTypeController {
    constructor($scope, FormService) {
        $scope.$watch('model.mapname', function () {
            if ($scope.model.mapname === undefined) {
                return console.log('returned');
            } else {
                FormService
                    .getDocType($scope.model.workspacecategory, $scope.model.mapname)
                    .then(function (response) {
                        $scope.to.options = response;
                        return response;
                    });
            }
        })
    }
}

export default DocumentTypeController;