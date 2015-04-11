define( [ 'angular' ] , function ( angular ) {
    var app = angular.module( 'app' , [] );

    app.config( [
        '$stateProvider' ,
        function ( $stateProvider ) {

            // 路由设置
            $stateProvider.state( 'index' , {
                url : '/' ,
                templateUrl : 'views/index.html' ,
                controller : 'IndexController' ,
                resolve : {
                    load : loadDeps( [ 'controllers/IndexController' ] )
                }
            } )
                .state( 'detail' , {
                    abstract : true ,
                    templateUrl : 'views/detail.html' ,
                    controller : 'DetailPanelController' ,
                    resolve : {
                        load : loadDeps( [ 'controllers/DetailPanelController' ] )
                    }
                } )
                .state( 'detail.content' , {
                    url : '/:id' ,
                    templateUrl : 'views/detail.content.html' ,
                    controller : 'DetailController' ,
                    resolve : {
                        load : loadDeps( [ 'controllers/DetailController' ] )
                    }
                } );

            // 默认路由
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
