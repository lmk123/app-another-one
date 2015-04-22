define( [
    '../app' , 'jquery' ,
    '../services/FetchVolFactory' ,
    '../services/NavService'
] , function ( app , $ ) {
    app.directive( 'volFav' , function () {
        return {
            link : function ( scope , element ) {
                element.click( function () {
                    element.toggleClass( 'active' );
                } );
            }
        };
    } );
    app.controller( 'VolController' , [
        '$scope' , '$stateParams' , 'FetchVolFactory' , 'NavService' ,
        function ( $scope , $stateParams , fetchVol , navFactory ) {
            $scope.showMenu = function () {
                alert( '菜单正在开发中 :)' );
            };
            $scope.status = {
                loading : true ,
                showMenu : false ,
                current : 1
            };

            $scope.switchTo = function ( number ) {
                $scope.status.current = number;
                $( 'html, body' ).animate( { scrollTop : 0 } , 500 );
            };

            $scope.volData = {
                id : $stateParams.id
            };

            $scope.next = navFactory.next;
            $scope.prev = navFactory.prev;

            fetchVol.getVolData( $stateParams.id ).then( function ( data ) {
                $scope.volData = data;
                $scope.status.loading = false;
            } , function () {
                alert( 'todo 文章不存在' );
                navFactory.back();
            } );
        }
    ] );
} );
