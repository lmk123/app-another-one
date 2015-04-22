define( [ 'angular' ] , function ( angular ) {
    var app = angular.module( 'app' , [] );

    app.config( [
        '$stateProvider' ,
        function ( $stateProvider ) {

            $stateProvider
                .state( 'index' , {
                    url : '/' ,
                    templateUrl : 'views/index.html' ,
                    controller : 'IndexController' ,
                    resolve : {
                        load : loadDeps( [ 'controllers/IndexController' ] )
                    }
                } )
                .state( 'detail' , {
                    url : '/vol/:id' ,
                    templateUrl : 'views/vol.html' ,
                    controller : 'VolController' ,
                    resolve : {
                        load : loadDeps( [ 'controllers/VolController' ] )
                    }
                } ).state( 'fav' , {
                    url : '/fav' ,
                    templateUrl : 'views/fav.html'
                } ).state( 'about' , {
                    url : '/about' ,
                    templateUrl : 'views/about.html'
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

            /**
             * 加载依赖的辅助函数
             * @param deps
             * @returns {*[]}
             */
            function loadDeps( deps ) {
                return [
                    '$q' , function ( $q ) {
                        var def = $q.defer();
                        require( deps , function () {
                            def.resolve();
                        } );
                        return def.promise;
                    }
                ];
            }
        }
    ] );

    // 当在首次打开的页面点返回上一页时，跳转到当天最新期数，
    // 否则就直接返回上一页
    app.run( [
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
    ] );

    return app;
} );
