define( [ '../app' ] , function ( app ) {
    app.factory( 'FavouriteFactory' , [
        '$q' ,
        'FileSystemFactory' , function ( $q , fsPromise ) {
            var filename = 'favourite.txt' ,
                factory  = {

                    /**
                     * Save the favourite list into file system.
                     * @param {number[]} list
                     * @returns {promise}
                     */
                    save : function ( list ) {
                        var def = $q.defer();
                        if ( 'object' === typeof list && list ) {
                            list = JSON.stringify( list );
                        }
                        fsPromise.then( function ( fs ) {
                            fs.writeFile( filename , [ list ] ).then( def.resolve );
                        } , def.reject );
                        return def.promise;
                    } ,

                    /**
                     * Read the favourite list.
                     * @param {boolean=} isSort If we use this method in `favourite-list.html`, we will need to sort it for a comfortable view.
                     * @returns {promise<number[]>}
                     */
                    read : function ( isSort ) {
                        var def = $q.defer();
                        fsPromise.then( function ( fs ) {
                            fs.readFile( filename , 'json' , true ).then( function ( favouriteList ) {
                                if ( !Array.isArray( favouriteList ) ) {
                                    favouriteList = [];
                                }
                                if ( isSort ) {
                                    favouriteList.sort( function ( a , b ) {
                                        return a > b ? 1 : -1;
                                    } );
                                }
                                def.resolve( favouriteList );
                            } );
                        } , def.reject );
                        return def.promise;
                    } ,

                    /**
                     * Clear the favourite list.
                     * @returns {promise}
                     */
                    clear : function () {
                        var def = $q.defer();
                        fsPromise.then( function ( fs ) {
                            fs.deleteFile( filename ).then( def.resolve , def.reject );
                        } , def.reject );
                        return def.promise;
                    } ,

                    /**
                     * Add a id into the favourite list.
                     * @param {number} id
                     * @returns {promise}
                     */
                    add : function ( id ) {
                        var def = $q.defer();

                        if ( 'number' !== typeof id ) {
                            id = Number( id );
                        }

                        factory.read().then( function ( favouriteList ) {
                            if ( favouriteList.indexOf( id ) < 0 ) {
                                favouriteList.push( id );
                            }
                            factory.save( favouriteList ).then( def.resolve );
                        } , def.reject );
                        return def.promise;
                    } ,

                    /**
                     * Delete a id from the favourite list.
                     * @param {number} id
                     * @returns {promise}
                     */
                    del : function ( id ) {
                        var def = $q.defer();
                        if ( 'number' !== typeof id ) {
                            id = Number( id );
                        }
                        factory.read().then( function ( favouriteList ) {
                            var index = favouriteList.indexOf( id );
                            if ( 0 <= index ) {
                                favouriteList.splice( index , 1 );
                            }
                            factory.save( favouriteList ).then( def.resolve );
                        } , def.reject );
                        return def.promise;
                    } ,

                    /**
                     * Detect a id is/not in the favourite list.
                     * @param {number} id
                     * @returns {promise<boolean>}
                     */
                    has : function ( id ) {
                        var def = $q.defer();
                        if ( 'number' !== typeof id ) {
                            id = Number( id );
                        }
                        factory.read().then( function ( favouriteList ) {
                            def.resolve( 0 <= favouriteList.indexOf( id ) );
                        } , def.reject );
                        return def.promise;
                    }
                };

            return factory;
        }
    ] );
} );
