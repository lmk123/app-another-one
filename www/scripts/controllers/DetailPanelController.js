define( [ '../app' ] , function ( app ) {
    app.controller( 'DetailPanelController' , [
        '$scope' ,
        function ( $scope ) {
            $scope.showMenu = function () {
                alert( 'todo' );
            };
            $scope.switchTo = function ( area ) {
                $scope.$broadcast( 'switch' , area );
            }
        }
    ] );
} );

