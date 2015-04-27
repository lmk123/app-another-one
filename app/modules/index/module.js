angular.module( 'app.index' , [
    [
        'services/NavService.js' ,
        'services/FetchVolFactory.js'
    ]
] ).controller( 'IndexController' , [
    '$state' , '$timeout' , 'FetchVolFactory' , 'NavService' ,
    function ( $state , $timeout , FetchVolService , NavService ) {
        var waitStart = Date.now();
        FetchVolService.getLastVolId().then( function ( lastId ) {
            var waitFor = Date.now() - waitStart ,
                timeout = 2000 - waitFor;
            if ( timeout < 0 ) {
                timeout = 0;
            }
            $timeout( function () {
                NavService.go( lastId );
            } , timeout );
        } );
    }
] );
