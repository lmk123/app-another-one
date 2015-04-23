define( [
    '../app' ,
    '../services/FetchVolFactory' ,
    '../services/NavService'
] , function ( app ) {
    app.directive( 'stopTouchend' , function () {
        return {
            link : function ( scope , element ) {
                element.bind( 'touchend' , function ( e ) {
                    e.stopPropagation();
                } );
            }
        };
    } );
    app.directive( 'volFav' , [
        '$timeout' , function ( $t ) {
            return {
                link : function ( scope , element ) {
                    var timeoutPromise;
                    scope.favMsg = '1'; //这里不能是空字符串，否则值不会传到 tooltip 指令里面去

                    element.bind( 'click' , function () {
                        scope.$apply( function () {
                            scope.favMsg = element.hasClass( 'active' ) ? '已取消收藏' : '收藏成功！';
                        } );
                        element.toggleClass( 'active' );
                        element.triggerHandler( 'open' );

                        $t.cancel( timeoutPromise );
                        timeoutPromise = $t( function () {
                            element.triggerHandler( 'close' );
                        } , 2000 , false );
                    } );
                }
            };
        }
    ] );
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
