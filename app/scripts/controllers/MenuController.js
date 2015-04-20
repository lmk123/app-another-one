define( [ '../app' ] , function ( app ) {
    app.controller( 'MenuController' , [
        '$scope' , 'NavService' , function ( $scope , NavService ) {
            $scope.go = '';
            $scope.jumpTo = function () {
                $scope.is.showMenu = false; // is 是父控制器里的对象属性。之所以用对象是为了不要在这个作用域中覆盖父控制器的属性
                NavService.go( $scope.go );
            };
        }
    ] )
} );
