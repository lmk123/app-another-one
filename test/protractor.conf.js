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
                angular.module( 'bootstrap' , [ 'ngMockE2E' , 'all' ] )
                    .run( [
                        '$httpBackend' ,
                        function ( $httpBackend ) {
                            $httpBackend.whenGET().passThrough();
                            $httpBackend.whenPOST().passThrough();
                        }
                    ] );
            }
        } );
    }
};

