define( [ '../app' ] , function ( app ) {
    app
        .directive( 'switchTo' , function () {
            return {
                link : function ( scope , element ) {
                    var dom = element[ 0 ];

                    setCurrent( scope.current );

                    scope.$watch( 'current' , function ( newValue ) {
                        setCurrent( newValue );
                    } );

                    function setCurrent( selector ) {
                        var last = dom.querySelector( '.vol-show' );
                        if ( last ) {
                            last.classList.remove( 'vol-show' );
                        }
                        dom.querySelector( selector ).classList.add( 'vol-show' );
                    }
                }
            };
        } )
        .controller( 'DetailController' , [
            '$scope' , '$stateParams' , 'FetchVolService' ,
            function ( $scope , $stateParams , FetchVolService ) {

                $scope.loading = true;
                $scope.current = '.vol-index';
                FetchVolService.getVolData( $stateParams.id ).then( function ( result ) {
                    $scope.detail = result;
                    $scope.loading = false;
                } );

                $scope.$on( 'switch' , function ( event , area ) {
                    $scope.current = '.vol-' + area;
                } );
            }
        ] );
} );
