define( [ '../app' ] , function ( app ) {
    app.controller( 'IndexController' , [
        '$state' , '$timeout' , 'FetchVolService' , 'NavService' ,
        function ( $state , $timeout , FetchVolService , NavService ) {
            var waitStart = Date.now();
            FetchVolService.getLastVolId().then( function ( result ) {
                var waitFor = Date.now() - waitStart ,
                    timeout = 2000 - waitFor;
                if ( timeout < 0 ) {
                    timeout = 0;
                }
                $timeout( function () {
                    NavService.go( result );
                } , timeout );
            } , function ( r ) {
                alert( r );
            } );
        }
    ] );
} );
