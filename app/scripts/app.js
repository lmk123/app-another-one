define( [ 'angular' ] , function ( angular ) {
    var app = angular.module( 'app' , [] );

    app.config( [
        '$stateProvider' ,
        function ( $stateProvider ) {

            $stateProvider.state( 'index' , {
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
                } )
                .state( 'detail.content' , {
                    templateUrl : 'views/detail.content.html' ,
                    controller : 'DetailController' ,
                    resolve : {
                        load : loadDeps( [ 'controllers/DetailController' ] )
                    }
                } )
                .state( 'about' , {
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

    return app;
} );
