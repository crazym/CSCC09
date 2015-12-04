QUnit.jUnitReport = function(report) {
    console.log(report.xml);   // send XML output report to console
};

test('Models can be initialized correctly', function() {

    //create a new instance of a User model
    var review = new splat.Review({'freshness': 1.0,
        'reviewtext': 'Tientien rocks!',
        'reviewname': 'minty',
        'reviewaffil':'zhangmao',
        'movieid': '557761f092e40db92c3ccdae'});
    // test that model has parameter attributes
    equal(review.get("freshness"), 1, "Review freshness set correctly");
    equal(review.get("reviewtext"), 'Tientien rocks!', "Review text set correctly");
    equal(review.get("reviewname"), 'minty', "Review name set correctly");
    equal(review.get("reviewaffil"), 'zhangmao', "Review affiliation set correctly");
    equal(review.get("movieid"), '557761f092e40db92c3ccdae', "Movie id set correctly");

});
// TODO
test("Show Validation Error on bad input field in movieForm.", function() {
    var changeModelCallback = this.spy();
    var movie = new splat.Movie();
    movie.bind( "change", changeModelCallback );
    movie.set( { "title": "Interstellar" } );
    ok( changeModelCallback.calledOnce,
        "A change event-callback was correctly triggered" );
});

// TODO
test("Test save movie model with missing fields will be rejected by server", function(assert) {
    assert.expect(4);   // 4 assertions to be run
    var done1 = assert.async();
    var done2 = assert.async();
    var errorCallback = this.spy();
    var movie = new splat.Movie({"__v":0,"dated":"2015-10-21T20:44:27.403Z",
        "director":"Sean Penn","duration":109,"freshTotal":18,"freshVotes":27,
        "poster":"img/uploads/5627f969b8236b2b7c0a37b6.jpeg?1448200894795",
        "rating":"R","released":"1999","synopsis":"great thriller",
        "title":"Zorba Games",
        "userid":"54635fe6a1342684065f6959", "genre":["action"],
        "starring":["Bruce Willis,Amy Winemouse"]});  // model
    var movies = new splat.Movies();  // collection
    // verify Movies-collection URL
    equal( movies.url, "/movies",
        "correct URL set for instantiated Movies collection" );
    // test "add" event callback when movie added to collection
    var addModelCallback = this.spy();
    movies.bind( "add", addModelCallback );
    movies.add(movie);
    ok( addModelCallback.called,
        "add callback triggered by movies collection add()" );
    // make sure user is logged out
    var user = new splat.User({username:"a", password:"a"});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.deepEqual( resp, {}, "Signout returns empty response object" );
            done1();

        }
    });
    auth.done(function() {
        movie.save(null, {
            error: function (model, error) {
                assert.equal( error.status, 403,
                    "Saving without authentication returns 403 status");
                done2();
            }
        });
    });
});

//TODO
test("Test movie-delete will remove the associated reviews as well.", function(assert) {
    var done1 = assert.async();
    var done2 = assert.async();
    var movie = new splat.Movie();  // model
    var movies = new splat.Movies();  // collection
    movies.add(movie);
    movie.set({"_id": "557761f092e40db92c3ccdae"});
    // make sure user is logged out
    var user = new splat.User({username:"a", password:"a"});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.deepEqual( resp, {}, "Signout returns empty response object" );
            done1();

        }
    });
    auth.done(function() {
        // try to destroy an existing movie
        movie.destroy({
            error: function (model, resp) {
                assert.equal( resp.status, 403,
                    "Deleting without authentication returns 403 status code" );
                done2();
            }
        });
    });
});

//TODO
test("Test movie-delete will fail if movie does not exist.", function(assert) {
    assert.expect( 3 );
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var movie = new splat.Movie();  // model
    movie.set("_id", "5650bf6b6f3c0a143c50994e");
    movie.urlRoot = '/movies';
    // fetch existing movie model
    var movieFetch = movie.fetch({
        success: function(movie, resp) {
            assert.equal( resp._id, "5650bf6b6f3c0a143c50994e",
                "Successful movie fetch" );
            done1();
        }
    });
    // authenticate user with valid credentials
    var user = new splat.User({username:"a", password:"a", login: 1});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.equal( resp.username, "a",
                "Successful login with valid credentials" );
            done2();
        }
    });
    $.when(movieFetch, auth).done(function() {
        // attempt to update existing movie
        movie.save({"title": "QUnit!"}, {
            success: function (model, resp) {
                assert.equal( resp.title, "QUnit!",
                    "Saving model update succeeds when logged in" );
                done3();
            }
        });
    });
});
