/**
 * 内容抓取服务。
 */
define( [ '../app' ] , function ( app ) {
    app.factory( 'FetchVolService' , [
        '$http' , '$q' , 'DataCacheService' ,
        function ( $http , $q , dataCache ) {
            var def = $q.defer();
            dataCache.then( function ( dataCache ) {

                // 如果域名设置成 http://wufazhuce.com，则要求设备允许跨域访问，
                // 而七牛云的静态文件都是带有 Access-Control-Allow-Origin:* 响应头的，
                // 所以灵光一闪，创建了一个七牛云空间并将镜像源设为 http://wufazhuce.com，
                // 哈哈哈哈哈 233333
                var DOMAIN    = 'https://dn-another-one.qbox.me' ,
                    monthMap  = {
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
                    } ,
                    firstTime = 1349625600000 ,//new Date( 2012 , 9 , 8 ).getTime()，第一期『一个』的日期
                    oneDay    = 86400000 , // 24 * 60 * 60 * 1000 = 一天是这么多毫秒数
                    factory   = {

                        /**
                         * 接收一个日期，返回『一个』的期数
                         * @param {Date=} date
                         * @returns {number}
                         */
                        getVolId : function ( date ) {
                            var def = $q.defer();
                            def.resolve( dateToVolId( date ) );
                            return def.promise;
                        } ,
                        getVolData : function ( id ) {
                            var def = $q.defer();
                            id = Number( id );
                            if ( id < 1 || id > dateToVolId() ) {
                                def.reject( '此次文章不存在' );
                            } else {
                                dataCache.get( id ).then( function ( cache ) {
                                    if ( cache ) {
                                        def.resolve( cache );
                                    } else {
                                        $http.get( DOMAIN + '/one/vol.' + id , {
                                            responseType : 'document'
                                        } ).then( function ( response ) {
                                            var document = response.data ,
                                                result;
                                            if ( document.title.indexOf( '一个' ) > 0 ) {
                                                result = volStringToJson( document );
                                                result.id = Number( id );
                                                dataCache.put( id , result );
                                                def.resolve( result );
                                            } else {
                                                return def.reject( '获取文章内容时出错，请检查你的网络设置' );
                                            }
                                        } , function ( response ) {
                                            if ( 404 === response.status ) {
                                                return def.reject( '此次文章不存在' );
                                            } else {
                                                return def.reject( '获取文章内容时出错，请检查你的网络设置' );
                                            }
                                        } );
                                    }
                                } );
                            }
                            return def.promise;
                        }
                    };
                def.resolve( factory );

                /**
                 * 给定日期，返回那天的『一个』期数
                 * @param {Date=} date
                 * @returns {number}
                 */
                function dateToVolId( date ) {
                    if ( !date ) {
                        date = new Date();
                    }
                    return ( new Date( date.getFullYear() , date.getMonth() , date.getDate() ).getTime() - firstTime) / oneDay + 1;
                }

                /**
                 * 从文档对象模型中提取数据
                 * @param {Document} document
                 * @returns {{}} 数据
                 */
                function volStringToJson( document ) {
                    var emptyContent = { textContent : '' } ,
                        data         = {
                            id : 0 , // 在外层赋值
                            date : {
                                year : 0 ,
                                month : 0 ,
                                day : Number( (document.querySelector( '.dom' ) || emptyContent).textContent.trim() )
                            } ,
                            index : {
                                imgUrl : (document.querySelector( '.one-imagen img' ) || { src : '' }).src ,
                                text : (document.querySelector( '.one-cita' ) || emptyContent).textContent.trim() ,
                                imgTitle : '' ,
                                imgAuthor : ''
                            } ,
                            article : {
                                summary : (document.querySelector( '.comilla-cerrar' ) || emptyContent).textContent.trim() ,
                                title : (document.querySelector( '.articulo-titulo' ) || emptyContent).textContent.trim() ,
                                author : '' ,
                                content : ''
                            } ,
                            qa : {
                                q_title : (document.querySelector( '.cuestion-q-icono+h4' ) || emptyContent).textContent.trim() ,
                                question : (document.querySelector( '.cuestion-contenido' ) || emptyContent).textContent.trim() ,
                                a_title : (document.querySelector( '.cuestion-a-icono+h4' ) || emptyContent).textContent.trim() ,
                                answer : ''
                            } ,
                            dx : {
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

                    return data;

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
                     * todo 文章内容偶尔会有图片，例如第28期。
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
            } );
            return def.promise;
        }
    ] );
} );
