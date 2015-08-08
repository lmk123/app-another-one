(function () {
    var concat = [
            'vendor/Dexie.js' ,
            'vendor/ionic/js/ionic.js' ,
            'vendor/angular/angular.js' ,
            'vendor/angular/angular-animate.js' ,
            'vendor/angular/angular-sanitize.js' ,
            'vendor/angular-ui/angular-ui-router.js' ,
            'vendor/ionic/js/ionic-angular.js' ,
            'js/app.js'
        ] ,
        s      = '';

    concat.forEach( function ( url ) {
        s += '<script src="' + url + '"></script>';
    } );

    document.write( s );
}());
