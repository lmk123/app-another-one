angular.module( 'app.moudles.volume' , [
    [ 'services/FetchVolFactory.js' , 'services/NavService.js' , 'services/FavouriteFactory.js' ]
] ).directive( 'stopTouchend' , function () {
    return {
        link : function ( scope , element ) {
            element.bind( 'touchend' , function ( e ) {
                e.stopPropagation();
            } );
        }
    };
} )
    .directive( 'volFav' , [
        '$timeout' , 'FavouriteFactory' , '$q' , function ( $t , favourite , $q ) {
            return {
                link : function ( scope , element ) {
                    var timeoutPromise;
                    scope.favMsg = '啊哦，程序出了点小问题，请稍后重试。'; //这里不能是空字符串，否则值不会传到 tooltip 指令里面去

                    favourite.has( scope.volData.id ).then( function ( isHas ) {
                        if ( isHas ) {
                            element.addClass( 'active' );
                        }
                    } );

                    element.bind( 'click' , function () {
                        var isDelete = element.hasClass( 'active' );

                        favourite[ isDelete ? 'del' : 'add' ]( scope.volData.id ).then( function () {
                            scope.favMsg = isDelete ? '已取消收藏' : '收藏成功！';
                            element.toggleClass( 'active' );
                            return $q.when( '' );
                        } , function () {
                            scope.favMsg = '你的设备不支持收藏功能，快去下载手机客户端！';
                            return $q.when( '' );
                        } ).then( function () {
                            // For the reason of why here is wrapped by a $timeout please
                            // refer to https://docs.angularjs.org/error/$rootScope/inprog?p0=$digest#triggering-events-programmatically
                            $t( function () {
                                element.triggerHandler( 'open' );
                                $t.cancel( timeoutPromise );
                                timeoutPromise = $t( function () {
                                    element.triggerHandler( 'close' );
                                } , 2000 , false );
                            } , 0 , false );
                        } );
                    } );
                }
            };
        }
    ] )
    .controller( 'VolController' , [
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
