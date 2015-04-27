angular.module( 'app.favourite' , [
    [ 'services/FavouriteFactory.js' ]
] ).controller( 'FavController' , [
    '$scope' ,
    'FavouriteFactory' ,
    function ( $s , fav ) {
        $s.clearList = function () {
            confirm( '你确定要清空收藏列表吗？' ) && fav.clear().then( function () {
                $s.list = [];
            } );
        };
        $s.list = [];
        $s.loading = true;
        fav.read( true ).finally( function () {
            $s.loading = false;
        } ).then( function ( list ) {
            $s.list = list;
        } , function () {
            $s.doNotSupport = true;
        } );
    }
] );

