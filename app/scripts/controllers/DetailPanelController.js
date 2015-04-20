define( [ '../app' ] , function ( app ) {
    app.controller( 'DetailPanelController' , [
        '$scope' , 'NavService' ,
        function ( $scope , NavService ) {
            $scope.switchTo = function ( area ) {
                $scope.$broadcast( 'switch' , area );
            };
            $scope.next = function () {
                NavService.next();
            };
            $scope.prev = function () {
                NavService.prev();
            };
            $scope.is = {
                showMenu : false
            };
        }
    ] );
} );

