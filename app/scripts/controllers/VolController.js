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
                current : 1 ,
                is404 : false
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
            } , function () {
                $scope.status.is404 = true;
            } ).finally( function () {
                $scope.status.loading = false;
            } );
        }
    ] );
} );
