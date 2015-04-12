define( [ '../app' ] , function ( app ) {
    app.factory( 'DataCacheService' , [
        '$cacheFactory' , '$q' , function ( $cacheFactory , $q ) {
            var memCache = $cacheFactory( 'vol-data-cache' ) ,
                def      = $q.defer();

            if ( !window.requestFileSystem ) {
                window.requestFileSystem = window.webkitRequestFileSystem;
            }

            navigator.webkitPersistentStorage.requestQuota( 500 * 1024 * 1024 /*500MB*/ , function ( grantedBytes ) {
                requestFileSystem( PERSISTENT , grantedBytes , function ( fs ) {
                    var factory = {};
                    factory.get = function ( key ) {
                        var def   = $q.defer() ,
                            cache = memCache.get( key );
                        if ( cache ) {
                            def.resolve( cache );
                        } else {
                            fs.root.getFile( key + '.txt' , { create : false } , function ( fileEntry ) {
                                fileEntry.file( function ( file ) {
                                    var reader = new FileReader();
                                    reader.onloadend = function () {
                                        var result = JSON.parse( reader.result );
                                        memCache.put( key , result );
                                        def.resolve( result );
                                    };
                                    reader.readAsText( file );
                                } );
                            } , function () {
                                def.resolve( false );
                            } );
                        }
                        return def.promise;
                    };
                    factory.put = function ( key , value ) {
                        memCache.put( key , value );
                        fs.root.getFile( key + '.txt' , { create : true } , function ( fileEntry ) {
                            fileEntry.createWriter( function ( witer ) {
                                witer.write( new Blob( [ JSON.stringify( value ) ] , { type : 'text/plain' } ) );
                            } );
                        } );
                    };
                    def.resolve( factory );
                } );
            } );

            return def.promise;
        }
    ] );
} );
