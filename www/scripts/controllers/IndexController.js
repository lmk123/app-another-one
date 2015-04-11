define( [ '../app' ] , function ( app ) {
    app.controller( 'IndexController' , [
        '$state' , '$timeout' , 'FetchVolService' ,
        function ( $state , $timeout , FetchVolService ) {
            var waitStart = Date.now();
            FetchVolService.getLastVolId().then( function ( result ) {
                if ( 'number' === typeof result ) {
                    var waitFor = Date.now() - waitStart ,
                        timeout = 2000 - waitFor;
                    if ( timeout < 0 ) {
                        timeout = 0;
                    }
                    $timeout( function () {
                        $state.go( 'detail.content' , { id : result } );
                    } , timeout );
                } else {
                    alert( result );
                }
            } );
        }
    ] );
} );
