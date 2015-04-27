angular.module( 'app.services.NavService' , [
    [ 'services/FetchVolFactory.js' ]
] ).factory( 'NavService' , [
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
] )
   /* .run( [
    '$rootScope' , 'NavService' , function ( $r , nav ) {
        var isFirstPage = true ,
            count       = 0;
        $r.goBack = function () {
            if ( isFirstPage ) {
                nav.goLastVol();
            } else {
                history.back();
            }
        };
        var remove = $r.$on( '$stateChangeSuccess' , function () {
            count += 1;
            if ( 2 === count ) {
                isFirstPage = false;
                remove();
            }
        } );
    }
] );*/


