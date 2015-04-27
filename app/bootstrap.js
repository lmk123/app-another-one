(function ( angular ) {
    var app = angular.module( 'app' , [
        'oc.lazyLoad' ,
        'ui.router' ,
        'ui.bootstrap' ,
        'ngSanitize' ,
        'ngTouch'
    ] );

    app.config( [
        '$tooltipProvider' ,
        function ( $tooltipProvider ) {
            // This trigger use in VolController.js
            $tooltipProvider.setTriggers( {
                open : 'close'
            } );
        }
    ] );

    app.config( [
        '$ocLazyLoadProvider' , function ( $llp ) {
            $llp.config( {
                debug : true
            } );
        }
    ] );

    app.config( [
        '$stateProvider' , function ( $sp ) {
            $sp
                .state( 'index' , {
                    url : '/' ,
                    templateUrl : 'modules/index/index.html' ,
                    controller : 'IndexController' ,
                    resolve : {
                        loadModule : loadDeps( 'modules/index/module.js' )
                    }
                } )
                .state( 'detail' , {
                    url : '/vol/:id' ,
                    templateUrl : 'modules/volume/vol.html' ,
                    controller : 'VolController' ,
                    resolve : {
                        load : loadDeps( 'modules/volume/module.js' )
                    }
                } ).state( 'fav' , {
                    url : '/fav' ,
                    templateUrl : 'modules/favourite/fav.html' ,
                    controller : 'FavController' ,
                    resolve : {
                        load : loadDeps( 'modules/favourite/module.js' )
                    }
                } ).state( 'about' , {
                    url : '/about' ,
                    templateUrl : 'views/about.html'
                } );

            $sp.state( 'otherwise' , {
                url : '*path' ,
                template : '' ,
                controller : [
                    '$state' ,
                    function ( $state ) {
                        $state.go( 'index' );
                    }
                ]
            } );

            function loadDeps( deps ) {
                return [
                    '$ocLazyLoad' , function ( $ll ) {
                        return $ll.load( deps );
                    }
                ];
            }
        }
    ] );

    app.run( [
        '$rootScope' ,
        '$ocLazyLoad' , '$injector' , function ( $r , $oll , $injector ) {
            $oll.load( 'services/NavService.js' ).then( function () {
                var nav         = $injector.get( 'NavService' ) ,
                    isFirstPage = true ,
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
            } );
        }
    ] );

    angular.module( 'bootstrap' , [ 'app' ] );
    angular.bootstrap( document , [ 'bootstrap' ] );
}( angular ));
