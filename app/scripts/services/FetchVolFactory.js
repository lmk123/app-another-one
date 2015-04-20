define( [ '../app' ] , function ( app ) {
    app.factory( 'FetchVolFactory' , [
        '$http' , '$q' , function ( $http , $q ) {
            var isCordova = 0 !== document.URL.indexOf( 'http' ) ,
                factory   = {
                    domain : isCordova ? 'http://wufazhuce.com' : 'https://dn-another-one.qbox.me' ,
                    getLastVolId : function () {
                        var def = $q.defer();
                        $http.get( factory.domain + '/one' , {
                            responseType : 'document'
                        } ).then( function ( response ) {
                            var str = response.data.querySelector( '#main-container .corriente .one-titulo a' ).textContent.trim();
                            def.resolve( Number( str.match( /vol\.(\d+)$/i )[ 1 ] ) );
                        } , function () {
                            def.reject();
                        } );
                        return def.promise;
                    } ,
                    getVolData : function ( id ) {
                        var def = $q.defer();
                        $http.get( factory.domain + '/one/vol.' + id , {
                            responseType : 'document'
                        } ).then( function ( response ) {
                            var document = response.data ,
                                result;
                            if ( document.title.indexOf( '一个' ) > 0 ) {
                                result = volDocumentToJson( document );
                                result.id = Number( id );
                                //dataCache.put( id , result );
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
                        return def.promise;
                    }
                };

            if ( isCordova ) {
                factory.getLastVolId = function () {
                    var def = $q.defer();
                    $http.get( factory.domain + '/one' , {
                        responseType : 'document'
                    } ).then( function ( response ) {
                        var str = response.data.querySelector( '#main-container .corriente .one-titulo a' ).textContent.trim();
                        def.resolve( Number( str.match( /vol\.(\d+)$/i )[ 1 ] ) );
                    } , function () {
                        def.reject();
                    } );
                    return def.promise;
                };
            } else {
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
             * @param {Date=} date
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
             * @returns {{}} 数据
             */
            function volDocumentToJson( document ) {
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

            return factory;
        }
    ] );
} );
