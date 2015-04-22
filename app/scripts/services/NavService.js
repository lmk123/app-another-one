/**
 * 内容导航服务。
 */
define( [ '../app' , './FetchVolFactory' ] , function ( app ) {
    app.factory( 'NavService' , [
        '$state' , '$stateParams' , 'FetchVolFactory' ,
        function ( $state , $stateParams , fetch ) {
            var factory = {
                go : function ( id ) {
                    $state.go( 'detail' , { id : id } );
                } ,
                goLastVol : function () {
                    fetch.getLastVolId().then( factory.go );
                } ,
                next : function () {
                    factory.go( Number( $stateParams.id ) + 1 );
                } ,
                prev : function () {
                    factory.go( Number( $stateParams.id ) - 1 );
                }
            };
            return factory;
        }
    ] );
} );
