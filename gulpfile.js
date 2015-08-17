var SRC        = './app' ,
    CDN        = './www' ,
    BundlePath = './bundle.js' ,
    paths      = {
        js : [ SRC + '/**/*.js' , '!' + SRC + '/' + BundlePath , '!' + SRC + '/vendor/**/*' ] ,
        cssFiles : [ SRC + '/**/*.css' , '!' + SRC + '/vendor/**/*' ] ,
        htmlFiles : [ SRC + '/**/*.html' , '!' + SRC + '/vendor/**/*' ] ,
        imageFiles : [ SRC + '/**/*.{png,jpg,gif}' , '!' + SRC + '/vendor/**/*' ] ,
        copyFiles : [
            SRC + '/**/*.{eot,svg,ttf,woff,jpg,png}'
        ]
    } ,

    concatList = JSON.parse( require( 'fs' ).readFileSync( SRC + '/' + BundlePath , { encoding : 'utf8' } ).match( /\[[^\]]+\]/ )[ 0 ].replace( /'/g , '"' ) ).map( function ( s ) {
        var toUrl = SRC + '/' + s;
        paths.js.push( '!' + toUrl );
        return toUrl;
    } ) ,

    gulp       = require( 'gulp' ) ,
    fs         = require( 'fs' ) ,
    sass       = require( 'gulp-sass' ) ,
    babel      = require( 'gulp-babel' ) ,
    watch      = require( 'gulp-watch' ) ,
    minifyJS   = require( 'gulp-uglify' ) ,
    minifyCSS  = require( 'gulp-minify-css' ) ,
    minifyHTML = require( 'gulp-htmlmin' ) ,
    concat     = require( 'gulp-concat' ) ,
    deleteFile = require( 'del' );

gulp.task( 'clean' , clean );

gulp.task( 'compile-es6-scss' , [ 'compile-scss' , 'compile-es6' ] );

gulp.task( 'bundle' , [ 'clean' , 'compile-es6-scss' ] , bundle );

gulp.task( 'js' , [ 'bundle' ] , js );

gulp.task( 'css' , [ 'bundle' ] , css );

gulp.task( 'html' , [ 'bundle' ] , html );

gulp.task( 'copy' , [ 'bundle' ] , copy );

gulp.task( 'default' , [ 'js' , 'css' , 'html' , 'copy' ] );

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

// es6 与 scss
/**
 * 监视所有以 .es6 .scss 为后缀的文件，并在文件改动时自动转换成正常的 .js .css 文件
 */
gulp.task( 'watch-es6-scss' , function ( done ) { // 带上这个 done 参数，控制台里就不会显示 Finished — 不带上其实任务也仍然在 watch 中
    watch( SRC + '/**/*.{es6,scss}' , function ( e ) {
        var fileFullPath = e.path ,
            isScss       = '.scss' === e.extname;

        switch ( e.event ) {
            case 'change':
                var dest = fileFullPath.slice( 0 , fileFullPath.lastIndexOf( '\\' ) );

                // scss 比较特殊，如果改动的是以下划线（_）开头的文件，就全部编译一次
                if ( isScss ) {
                    if ( '_' === e.basename[ 0 ] ) {
                        console.warn( '检测到更改了以下划线开头的 scss 文件（' + e.basename + '），正在重新编译整个项目……' );
                        complieScss()
                            .on( 'finish' , function () {
                                console.log( '编译完成。' );
                            } ); // 这个操作可能会触发此 watch
                    } else {
                        complieScss( fileFullPath , dest );
                    }
                } else {
                    complieEs6( fileFullPath , dest );
                }
                break;
            case 'unlink':
                var path = fileFullPath.slice( 0 , fileFullPath.lastIndexOf( '.' ) ) + (isScss ? '.css' : '.js');
                fs.unlink( path/* , function () {
                 console.log( 'Deleted file:' + path );
                 }*/ );
                break;
            case 'add':
                //console.log( 'Added:' + fileFullPath );
                break;
        }

    } );
} );

/**
 * 将所有 es6 文件转换成 .js 文件
 */
gulp.task( 'compile-es6' , function () {
    return complieEs6();
} );

/**
 * 将所有 scss 文件转换成 .css 文件
 */
gulp.task( 'compile-scss' , function () {
    return complieScss();
} );

/**
 * 将所有 .es6 文件转换成 .js 文件
 * @params {String} [path]
 * @params {String} [dest]
 */
function complieEs6( path , dest ) {
    return gulp.src( path || SRC + '/**/*.es6' )
        .pipe( babel().on( 'error' , function ( err ) {
            console.error( err );
        } ) )
        .pipe( gulp.dest( dest || SRC ) )
        .on( 'error' , sass.logError );
}

/**
 * 将所有 .scss 文件转换成 .css 文件
 * @params {String} [path]
 * @params {String} [dest]
 */
function complieScss( path , dest ) {
    return gulp.src( path || SRC + '/**/*.scss' )
        .pipe( sass().on( 'error' , sass.logError ) )
        .pipe( gulp.dest( dest || SRC ) );
}
