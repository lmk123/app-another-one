/**
 * 内容导航服务。
 */
define( [ '../app' ] , function ( app ) {
    app.factory( 'NavService' , [
        '$state' , '$stateParams' ,
        function ( $state , $stateParams ) {
            var factory = {
                go : function ( id ) {
                    $state.go( 'detail' , { id : id } );
                } ,
                next : function () {
                    factory.go( Number( $stateParams.id ) + 1 );
                } ,
                prev : function () {
                    factory.go( Number( $stateParams.id ) - 1 );
                } ,
                back : function () {
                    history.back();
                }
            };
            return factory;
        }
    ] );
} );
