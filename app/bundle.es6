(function () {
    var concat = [
            'vendor/IndexedDBShim/dist/indexeddbshim.js' ,
            'vendor/dexie/dist/latest/Dexie.js' ,


            'vendor/ionic/release/js/ionic.js' ,
            'vendor/angular/angular.js' ,
            'vendor/angular-animate/angular-animate.js' ,
            'vendor/angular-sanitize/angular-sanitize.js' ,
            'vendor/angular-ui-router/release/angular-ui-router.js' ,
            'vendor/ionic/release/js/ionic-angular.js' ,


            'js/app.js'
        ] ,
        s      = '';

    concat.forEach( function ( url ) {
        s += '<script src="' + url + '"></script>';
    } );

    document.write( s );
}());
