class WorkspaceCategoryController {
    constructor($scope, FormService) {
        FormService
            .getSapObjectOptions()
            .then(function (response) {
                $scope.to.options = response;
                return response;
            });
    }
}

export default WorkspaceCategoryController;