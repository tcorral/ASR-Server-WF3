class PostBusController {
    constructor($scope, FormService) {
        FormService.getPostBus().then(response =>{
            $scope.to.options = response;
        });
    }
}
export default PostBusController;