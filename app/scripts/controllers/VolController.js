define( [ '../app' , 'jquery' ] , function ( app , $ ) {
    app.directive( 'volPanel' , function () {
        return {
            link : function ( scope , element ) {
                element.on( 'click' , 'a' , function ( e ) {
                    var $this = $( this ) ,
                        index = $this.index();
                    e.preventDefault();
                    $this.addClass( 'active' ).siblings( '.active' ).removeClass( 'active' );
                    $( '#tabs-content > :eq(' + index + ')' ).addClass( 'active' ).siblings( '.active' ).removeClass( 'active' );
                    $( 'html, body' ).animate( { scrollTop : 0 } , 500 );
                } );
            }
        };
    } );
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
            $scope.status = {
                loading : true ,
                showMenu : false
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
