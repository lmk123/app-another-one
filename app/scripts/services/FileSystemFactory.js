define( [ '../app' ] , function ( app ) {
    app.factory( 'FileSystemFactory' , [
        '$q' , function ( $q ) {
            var asyncFactory = $q.defer();
            if ( !window.requestFileSystem ) {
                window.requestFileSystem = window.webkitRequestFileSystem;
            }
            if ( requestFileSystem && navigator.webkitPersistentStorage && navigator.webkitPersistentStorage.requestQuota && window.PERSISTENT ) {
                navigator.webkitPersistentStorage.requestQuota( 500 * 1024 * 1024 /*500MB*/ , function ( grantedBytes ) {
                    requestFileSystem( PERSISTENT , grantedBytes , function ( fs ) {
                        var root    = fs.root ,
                            factory = {};

                        /**
                         * 将文件对象转换成其它形式的方法
                         * @param {File} fileObj
                         * @param {string=} fileType
                         *   fileType 应该为以下几个选项之一：
                         *     text：将文件对象转换为字符串。默认设置。
                         *     json：与 text 相同，只是最后会尝试使用 JSON.parse() 转换一遍。
                         *     dataUrl：将 fileObj 转换为 data url，常用于图片。
                         * @returns {IPromise<T>}
                         */
                        factory.fileReader = function ( fileObj , fileType ) {
                            var reader = new FileReader() ,
                                def    = $q.defer();
                            if ( !fileType ) {
                                fileType = 'text';
                            }
                            reader.onload = function () {
                                var result = reader.result;
                                if ( 'json' === fileType ) {
                                    try {
                                        result = JSON.parse( result );
                                    }
                                    catch ( e ) {}
                                }
                                def.resolve( result );
                            };
                            reader.onerror = def.reject;
                            if ( 'text' === fileType || 'json' === fileType ) {
                                reader.readAsText( fileObj );
                            } else if ( 'dataUrl' === fileType ) {
                                reader.readAsDataURL( fileObj );
                            } else {
                                throw new Error( 'FileSystemFactory.fireReader method Don\'t support fileType "' + fileType + '".' );
                            }
                            return def.promise;
                        };

                        /**
                         * 读取文件的方法。
                         * @param {string} filename 文件名
                         * @param {string=} fileType 如果是 'file'，则会直接返回 file 对象，否则会传给 factory.fileReader 处理。
                         * @returns {IPromise<T>}
                         */
                        factory.readFile = function ( filename , fileType ) {
                            var def = $q.defer();
                            root.getFile( filename , { create : false } , function ( fileEntry ) {
                                fileEntry.file( function ( file ) {
                                    if ( 'file' === fileType ) {
                                        def.resolve( file );
                                    } else {
                                        factory.fileReader( file , fileType ).then( def.resolve , def.reject );
                                    }
                                } );
                            } , def.reject );
                            return def.promise;
                        };

                        /**
                         * 写入文件的方法。
                         * @param {string} filename 文件名
                         * @param {Array} data 数组数据，直接传给 new Blob
                         * @param {string} type 文件的 content type 字符串，直接传给 new Blob
                         * @returns {IPromise<T>}
                         */
                        factory.writeFile = function ( filename , data , type ) {
                            var def = $q.defer();
                            root.getFile( filename , { create : true } , function ( fileEntry ) {
                                fileEntry.createWriter( function ( witer ) {
                                    witer.onerror = def.reject;
                                    witer.onwriteend = def.resolve;
                                    witer.write( new Blob( data , { type : type } ) );
                                } );
                            } );
                            return def.promise;
                        };
                        asyncFactory.resolve( factory );
                    } );
                } );
            } else {
                asyncFactory.reject();
            }
            return asyncFactory.promise;
        }
    ] );
} );
