var SRC        = './app' ,
    CDN        = './www' ,
    BundlePath = './bundle.js' ,
    paths      = {
        js : [ SRC + '/**/*.js' , '!' + SRC + '/' + BundlePath ] ,
        cssFiles : [ SRC + '/**/*.css' ] ,
        htmlFiles : SRC + '/**/*.html' ,
        imageFiles : SRC + '/**/*.{png,jpg,gif}' ,
        copyFiles : [ SRC + '/**/*' , '!' + SRC + '/**/*.{js,css,html}' ]
    } ,

    concatList = JSON.parse( require( 'fs' ).readFileSync( SRC + '/' + BundlePath , { encoding : 'utf8' } ).match( /\[[^\]]+\]/ )[ 0 ].replace( /'/g , '"' ) ).map( function ( s ) {
        var toUrl = SRC + '/' + s;
        paths.js.push( '!' + toUrl );
        return toUrl;
    } ) ,

    gulp       = require( 'gulp' ) ,
    minifyJS   = require( 'gulp-uglify' ) ,
    minifyCSS  = require( 'gulp-minify-css' ) ,
    minifyHTML = require( 'gulp-htmlmin' ) ,
    concat     = require( 'gulp-concat' ) ,
    deleteFile = require( 'del' );

gulp.task( 'clean' , clean );

gulp.task( 'bundle' , [ 'clean' ] , bundle );

gulp.task( 'js' , [ 'clean' ] , js );

gulp.task( 'css' , [ 'clean' ] , css );

gulp.task( 'html' , [ 'clean' ] , html );

gulp.task( 'copy' , [ 'clean' ] , copy );

gulp.task( 'default' , [ 'bundle' , 'js' , 'css' , 'html' , 'copy' ] );

function clean( cb ) {
    deleteFile( [ CDN ] , cb );
}

function js() {
    return gulp.src( paths.js )
        .pipe( minifyJS() )
        .pipe( gulp.dest( CDN ) );
}

function css() {
    return gulp.src( paths.cssFiles )
        .pipe( minifyCSS() )
        .pipe( gulp.dest( CDN ) );
}

function html() {
    return gulp.src( paths.htmlFiles , { base : SRC } )
        .pipe( minifyHTML( {
            removeComments : true ,
            collapseWhitespace : true
        } ) )
        .pipe( gulp.dest( CDN ) );
}

function copy() {
    return gulp.src( paths.copyFiles )
        .pipe( gulp.dest( CDN ) );
}

function bundle() {
    return gulp.src( concatList )
        .pipe( concat( BundlePath ) )
        .pipe( minifyJS() )
        .pipe( gulp.dest( CDN ) );
}
