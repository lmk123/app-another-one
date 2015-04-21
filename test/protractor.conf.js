// conf.js
exports.config = {
    framework : 'jasmine2' ,
    directConnect : true ,
    //seleniumAddress : 'http://localhost:4444/wd/hub' ,
    specs : [ './e2e/**/*Spec.js' ] ,

    params : {

        // 如果要测试线上环境，改变这个 url 就可以了
        urlRoot : 'http://localhost:61111/one/app/'
        //urlRoot : 'http://lmk123.github.io/app-another-one/www/199eedffc73152e8ad19f9949e26927f.html'
    } ,

    onPrepare : function () {
        browser.addMockModule( 'bootstrap' , function () {
            if ( angular.mock ) {
                // 这里的依赖列表就比 bootstrap.js 里面多一个 'ngMockE2E'，
                // 如果 bootstrap.js 里面的依赖列表变了，那么这边也要同步变动
                angular.module( 'bootstrap' , [ 'ngMockE2E' , 'ui.router' , 'ngSanitize' , 'ngTouch' , 'app' ] )
                    .run( [
                        '$httpBackend' ,
                        function ( $httpBackend ) {
                            $httpBackend.whenGET().passThrough();
                            $httpBackend.whenPOST().passThrough();
                        }
                    ] );
            } else { // 没有引用 ngMockE2E 时就不 mock 了
                angular.module( 'bootstrap' , [ 'ui.router' , 'ngSanitize' , 'ngTouch' , 'app' ] );
            }
        } );
    }
};

