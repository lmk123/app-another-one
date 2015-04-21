describe( '测试首页' , function () {

    it( '两秒过后会自动跳转' , function ( done ) {
        browser.get( browser.params.urlRoot + '#/' );
        browser.sleep( 3000 ).then( function () {
            browser.getCurrentUrl().then( function ( url ) {
                expect( url.slice( url.lastIndexOf( '#' ) ) ).toMatch( /^#\/vol\/\d+$/ );
                done();
            } );
        } );
    } );

} );
