define( [
    '../app' , /*'jquery' ,*/
    '../services/FetchVolFactory' ,
    '../services/NavService'
] , function ( app/* , $*/ ) {
    app.directive( 'volFav' , function () {
        return {
            link : function ( scope , element ) {
                var ele = element[ 0 ];
                ele.addEventListener( 'click' , function () {
                    ele.classList.toggle( 'active' );
                } );
            }
        };
    } );
    app.controller( 'VolController' , [
        '$scope' , '$stateParams' , 'FetchVolFactory' , 'NavService' , '$modal' ,
        function ( $scope , $stateParams , fetchVol , navFactory , $modal ) {
            $scope.openGoToModal = function () {
                var modal = $modal.open( {
                    templateUrl : 'myModalContent.html'
                } );
                modal.result.then( navFactory.go );
            };

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
                //$( 'html, body' ).animate( { scrollTop : 0 } , 500 );
                window.scrollTo( 0 , 0 );
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
