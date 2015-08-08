angular.module( 'AppAnotherOne' , [ 'ionic' ] )
    // 路由表
    .config( [
        '$stateProvider' ,
        function ( $stateProvider ) {

            $stateProvider
                .state( 'index' , { // 首页仅用于跳转到最新一期内容去
                    url : '' ,
                    controller : [
                        'FetchVolFactory' , 'NavService' ,
                        function ( FetchVolService , NavService ) {
                            FetchVolService.getLastVolId().then( function ( lastId ) {
                                NavService.go( lastId , true );
                            } );
                        }
                    ]
                } )
                .state( 'vol' , {
                    templateUrl : 'views/vol/container.html'
                } )
                .state( 'vol.detail' , {
                    url : '/vol/{id:int}' ,
                    templateUrl : 'views/vol/detail.html'
                } )
                .state( 'cached-list' , {
                    url : '/cached' ,
                    templateUrl : 'views/cached/list.html'
                } );

            $stateProvider.state( 'otherwise' , {
                url : '*path' ,
                template : '' ,
                controller : [
                    '$state' ,
                    function ( $state ) {
                        $state.go( 'index' );
                    }
                ]
            } );
        }
    ] )
    .factory( 'FavouriteFactory' , [
        '$q' , 'IndexDBFactory' , function ( $q , db ) {
            return {

                /**
                 * Read the favourite list.
                 * @param {Boolean} [isSort] If we use this method in `favourite-list.html`, we will need to sort it for a comfortable view.
                 * @returns {promise<number[]>}
                 */
                read : function ( isSort ) {
                    var def = $q.defer();
                    db.vols.where( 'favourite' ).equals( 1 ).toArray().then( function ( array ) {
                        if ( isSort ) {
                            array.sort( function ( a , b ) {
                                return a.id > b.id ? 1 : -1;
                            } );
                        }
                        def.resolve( array );
                    } );
                    return def.promise;
                } ,

                /**
                 * Clear the favourite list.
                 * @returns {promise}
                 */
                clear : function () {
                    var def = $q.defer();
                    db.vols.where( 'favourite' ).equals( 1 ).modify( { favourite : 0 } ).then( def.resolve , def.reject );
                    return def.promise;
                } ,

                /**
                 * Add a id into the favourite list.
                 * @param {Number} id
                 * @returns {promise}
                 */
                add : function ( id ) {
                    var def = $q.defer();

                    if ( 'number' !== typeof id ) {
                        id = Number( id );
                    }

                    db.vols.where( 'id' ).equals( id ).modify( { favourite : 1 } ).then( def.resolve , def.reject );
                    return def.promise;
                } ,

                /**
                 * Delete a id from the favourite list.
                 * @param {Number} id
                 * @returns {promise}
                 */
                del : function ( id ) {
                    var def = $q.defer();
                    if ( 'number' !== typeof id ) {
                        id = Number( id );
                    }
                    db.vols.where( 'id' ).equals( id ).modify( { favourite : 0 } ).then( def.resolve , def.reject );
                    return def.promise;
                } ,

                /**
                 * Detect a id is/not in the favourite list.
                 * @param {Number} id
                 * @returns {promise<boolean>}
                 */
                has : function ( id ) {
                    var def = $q.defer();
                    if ( 'number' !== typeof id ) {
                        id = Number( id );
                    }
                    db.vols.get( id ).then( function ( value ) {
                        if ( value && value.favourite ) {
                            def.resolve( value );
                        } else {
                            def.reject();
                        }
                    } );
                    return def.promise;
                }
            };
        }
    ] )
    .factory( 'FetchVolFactory' , [
        '$http' , '$q' , 'IndexDBFactory' , function ( $http , $q , db ) {
            var isCordova = 0 !== location.href.indexOf( 'http' ) ,
                factory   = {
                    domain : isCordova ? 'http://wufazhuce.com' : 'https://dn-another-one.qbox.me' , // 为了能让网页跨域，我配置了一个代理
                    picProxyDomain : 'https://dn-one-pic.qbox.me' , // 『一个』的图片做了防盗链，为了在网站上显示，我配置了一个代理

                    /**
                     * 通过 http 从远程服务器获取某期内容
                     * @param {Number} id - 第几期
                     * @returns {promise}
                     */
                    getVolDataFromHttp : function ( id ) {
                        var def = $q.defer();
                        $http.get( factory.domain + '/one/vol.' + id , {
                            responseType : 'document'
                        } ).then( function ( response ) {
                            var document = response.data ,
                                result;
                            if ( document.title.indexOf( '一个' ) > 0 ) {
                                result = volDocumentToJson( document );
                                result.id = Number( id );
                                def.resolve( result );

                                // 将数据写进 IndexDB 的 vols 表里
                                db.vols.add( result );
                            } else {
                                return def.reject( '获取文章内容时出错，请检查你的网络设置' );
                            }
                        } , function ( response ) {
                            if ( 404 === response.status ) {
                                return def.reject( '没有当期内容' );
                            } else {
                                return def.reject( '获取文章内容时出错，请检查你的网络设置' );
                            }
                        } );
                        return def.promise;
                    } ,

                    /**
                     * 获取某期内容，会先尝试从 file system 中读取，否则从 远程服务器获取
                     * @param {Number} id
                     * @returns {promise}
                     */
                    getVolData : function ( id ) {
                        var def = $q.defer();
                        db.vols.get( id ).then( function ( value ) {
                            if ( value ) {
                                def.resolve( value );
                            } else {
                                factory.getVolDataFromHttp( id ).then( def.resolve , def.reject );
                            }
                        } );
                        return def.promise;
                    }
                };

            if ( isCordova ) {
                /**
                 * 如果是在 phone gap 里，则从远程服务器获取当天最新的期数
                 * @returns {promise}
                 */
                factory.getLastVolId = function () {
                    var def = $q.defer();
                    $http.get( factory.domain + '/one?' + Math.random() , {
                        responseType : 'document'
                    } ).then( function ( response ) {
                        var str = response.data.querySelector( '#main-container .corriente .one-titulo a' ).textContent.trim();
                        def.resolve( Number( str.match( /vol\.(\d+)$/i )[ 1 ] ) );
                    } , function () {
                        def.resolve( dateToVolId() ); // 网络出错的情况下，通过日期计算出最新 vol id
                    } );
                    return def.promise;
                };
            } else {
                /**
                 * 如果不是在 phone gap 里，则通过日期计算出最新期数。
                 * 由于『一个』在每天晚上十点发布第二天的内容，所以此计算方法可能会延迟一天。
                 * @returns {promise}
                 */
                factory.getLastVolId = function () {
                    var def = $q.defer();
                    def.resolve( dateToVolId() );
                    return def.promise;
                };
            }

            var firstTime = 1349625600000 ,//new Date( 2012 , 9 , 8 ).getTime()，第一期『一个』的日期
                oneDay    = 86400000; // 24 * 60 * 60 * 1000 = 一天是这么多毫秒数
            /**
             * 给定日期，返回那天的『一个』期数
             * @param {Date} [date] - 默认为当天
             * @returns {number}
             */
            function dateToVolId( date ) {
                if ( !date ) {
                    date = new Date();
                }
                return ( new Date( date.getFullYear() , date.getMonth() , date.getDate() ).getTime() - firstTime) / oneDay + 1;
            }

            var monthMap = {
                Jan : 1 ,
                Feb : 2 ,
                Mar : 3 ,
                Apr : 4 ,
                May : 5 ,
                Jun : 6 ,
                Jul : 7 ,
                Aug : 8 ,
                Sep : 9 ,
                Oct : 10 ,
                Nov : 11 ,
                Dec : 12
            };

            /**
             * 从文档对象模型中提取数据
             * @param {Document} document
             * @returns {{}} - 数据
             */
            function volDocumentToJson( document ) {
                var emptyContent = { textContent : '' } ,
                    data         = {
                        id : null , // 第几期内容。索引
                        favourite : 0 , // 是否收藏，默认否。因为 IndexedDB 里面的索引的值不能为 Boolean 类型，所以使用 1 和 0 代替
                        date : {
                            year : null ,
                            month : null ,
                            day : Number( (document.querySelector( '.dom' ) || emptyContent).textContent.trim() )
                        } ,
                        index : {
                            imgUrl : (document.querySelector( '.one-imagen img' ) || { src : '' }).src ,
                            text : (document.querySelector( '.one-cita' ) || emptyContent).textContent.trim() ,
                            imgTitle : null ,
                            imgAuthor : null
                        } ,
                        article : {
                            summary : (document.querySelector( '.comilla-cerrar' ) || emptyContent).textContent.trim() ,
                            title : (document.querySelector( '.articulo-titulo' ) || emptyContent).textContent.trim() ,
                            author : null ,
                            content : null
                        } ,
                        qa : {
                            q_title : (document.querySelector( '.cuestion-q-icono+h4' ) || emptyContent).textContent.trim() ,
                            question : (document.querySelector( '.cuestion-contenido' ) || emptyContent).textContent.trim() ,
                            a_title : (document.querySelector( '.cuestion-a-icono+h4' ) || emptyContent).textContent.trim() ,
                            answer : null
                        } ,
                        dx : {
                            // todo 第1001期的东西的图片 url 显示错误成 http://m.wufazhuce.com/thing/2015-07-09 了
                            imgUrl : (document.querySelector( '.cosas-imagen img' ) || { src : '' }).src ,
                            title : (document.querySelector( '.cosas-titulo' ) || emptyContent).textContent.trim() ,
                            summary : (document.querySelector( '.cosas-contenido' ) || emptyContent).textContent.trim()
                        }
                    };

                splitIndexImgTitleAndAuthor( (document.querySelector( '.one-imagen-leyenda' ) || emptyContent).textContent );
                articleAuthor( ( document.querySelector( '.articulo-autor' ) || { textContent : '' }).textContent );
                articleContent( document.querySelector( '.articulo-contenido' ).textContent );
                qaAnswer( ( (document.querySelectorAll( '.cuestion-contenido' ) || [])[ 1 ] || emptyContent).textContent );
                splitYearAndMonth( (document.querySelector( '.may' ) || emptyContent).textContent );

                // 如果是在网页中运行，则将首页和东西的图片域名改为代理
                if ( !isCordova ) {
                    data.index.imgUrl = changeUrlDomain( data.index.imgUrl , factory.picProxyDomain );
                    data.dx.imgUrl = changeUrlDomain( data.dx.imgUrl , factory.picProxyDomain );
                }

                return data;

                /**
                 * 更改网址的域名的辅助函数
                 * @param {String} url - 要被更改的网址
                 * @param {String} newDomain - 新域名
                 * @returns {String}
                 */
                function changeUrlDomain( url , newDomain ) {
                    return url.replace( /^https?:\/\/[^\/]+\// , newDomain + '/' );
                }

                function splitYearAndMonth( text ) {
                    var yearAndMonth;
                    text = text.trim();
                    yearAndMonth = text.split( /\s+/ );
                    data.date.year = Number( yearAndMonth[ 1 ] );
                    data.date.month = monthMap[ yearAndMonth[ 0 ] ] || 0;
                }

                /**
                 * 分离出图片标题和作者
                 * @param {string} text
                 */
                function splitIndexImgTitleAndAuthor( text ) {
                    var titleAndAuthor = text.trim().split( '\n' ) ,
                        authroIn;
                    if ( 1 === titleAndAuthor.length ) { // 第24期的插画没有标题
                        titleAndAuthor.unshift( '' );
                    }
                    authroIn = titleAndAuthor[ 1 ];
                    data.index.imgTitle = titleAndAuthor[ 0 ];
                    data.index.imgAuthor = authroIn.slice( 0 , authroIn.indexOf( ' ' ) );
                }

                /**
                 * 分离出文章作者
                 * @param {string} text
                 */
                function articleAuthor( text ) {
                    text = text.trim();
                    data.article.author = text.slice( text.indexOf( '/' ) + 1 );
                }

                /**
                 * 整理文章内容。
                 * @todo 文章内容偶尔会有图片，例如第28期。
                 * @param {string} text
                 */
                function articleContent( text ) {
                    data.article.content = '<p>' + text.trim().replace( /(\r?\n)+/g , '</p><p>' ) + '</p>';
                }

                /**
                 * 整理答案内容
                 * @param {string} text
                 */
                function qaAnswer( text ) {
                    data.qa.answer = '<p>' + text.trim().replace( /(\r?\n)+/g , '</p><p>' ) + '</p>';
                }

            }

            return factory;
        }
    ] )
    .factory( 'IndexDBFactory' , [
        function () {
            var db = new Dexie( 'AppAnotherOne' );
            db.version( 1 ).stores( {
                vols : '&id,favourite'
            } );
            db.open();
            //db.delete();
            return db;
        }
    ] )
    .factory( 'NavService' , [
        '$state' , '$stateParams' ,
        function ( $state , $stateParams ) {
            var factory = {
                /**
                 * 跳转到某一期内容
                 * @param {Number} id - 那一期内容的 id 号
                 * @param {Boolean} [isReplace=false] - 是否要替换历史记录
                 * @returns {*|promise|void}
                 */
                go : function ( id , isReplace ) {
                    return $state.go( 'vol.detail' , { id : id } , { location : isReplace ? 'replace' : true } );
                } ,
                next : function () {
                    return factory.go( Number( $stateParams.id ) + 1 );
                } ,
                prev : function () {
                    return factory.go( Number( $stateParams.id ) - 1 );
                }
            };
            return factory;
        }
    ] )
    .controller( 'JumpController' , [
        '$scope' , '$state' , '$ionicSideMenuDelegate' ,
        function ( $scope , $state , $ionicSideMenuDelegate ) {
            $scope.go = function () {
                $ionicSideMenuDelegate.toggleLeft( false );
                $state.go( 'vol.detail' , { id : $scope.id } );
            };
        }
    ] )
    .controller( 'CacehdListController' , [
        '$scope' , function ( $scope ) {

        }
    ] )
    .controller( 'NavController' , [
        '$scope' , 'NavService' ,
        function ( $scope , nav ) {
            $scope.next = nav.next;
            $scope.prev = nav.prev;
        }
    ] )
    .controller( 'VolDetailCtrl' , [
        '$scope' , '$stateParams' , 'FetchVolFactory' ,
        function ( $scope , $stateParams , fetchVol ) {
            $scope.context = {
                loading : true ,
                is404 : false
            };
            $scope.model = {};

            $scope.model.id = $stateParams.id;

            fetchVol.getVolData( $stateParams.id ).then( function ( data ) {
                $scope.model = data;
            } , function () {
                $scope.context.is404 = true;
            } ).finally( function () {
                $scope.context.loading = false;
                //$timeout( function () {
                //    $ionicScrollDelegate.resize();
                //} );
            } );
        }
    ] )
    .controller( 'CachedListController' , [
        '$scope' , 'IndexDBFactory' , '$state' ,
        function ( $scope , db , $state ) {
            $scope.context = {
                favOnly : false ,
                loading : true
            };

            $scope.goBack = function () {
                history.back();
            };

            $scope.getVolLink = function ( id ) {
                return $state.href( 'vol.detail' , { id : id } );
            };

            $scope.getList = function () {
                $scope.context.loading = true;
                // IndexedDB 索引的值不能为 Boolean 类型
                var list = db.vols;
                if ( $scope.context.favOnly ) {
                    list = db.vols.where( 'favourite' ).equals( 1 );
                } else {
                    list = db.vols;
                }
                return list.toArray().then( function ( array ) {
                    array.sort( function ( a , b ) {
                        return a.id > b.id ? 1 : -1;
                    } );
                    $scope.$applyAsync( function () {
                        $scope.list = array;
                        $scope.context.loading = false;
                    } );
                } );
            };

            $scope.getList();
        }
    ] )
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
    .run( function () {
        if ( window.cordova && window.cordova.plugins.Keyboard ) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar( true );
        }
        if ( window.StatusBar ) {
            StatusBar.styleDefault();
        }
    } );

ionic.Platform.ready( function () {
    angular.bootstrap( document.body , [ 'AppAnotherOne' ] );
} );

