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

test("Test XSS attack will be protected by escape", function(){

    var xssAttack = "<script>alert(1)</script>";
    var inputValue = _.escape(xssAttack);
    equal(inputValue, "&lt;script&gt;alert(1)&lt;/script&gt;", "HTML tags will be replaced correctly");
});


test("Test save movie model with same title-director pair will be rejected by server", function(assert) {
    assert.expect( 4 );
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var done4 = assert.async();
    var movie = new splat.Movie({"__v":0,"dated":"2015-10-21T20:44:27.403Z",
        "director":"Sean Punn","duration":109,"freshTotal":18,"freshVotes":27,
        "poster":"img/uploads/5627f969b8236b2b7c0a37b6.jpeg?1448200894795",
        "rating":"R","released":"1999","synopsis":"great thriller",
        "title":"A Special Title So No Duplicates in DB",
        "trailer":"http://archive.org",
        "userid":"54635fe6a1342684065f6959", "genre":["action"],
        "starring":["Bruce Willis,Amy Winemouse"]});  // model
    movie.urlRoot = '/movies';
    // authenticate user with valid credentials
    var user = new splat.User({username:"a", password:"a", login: 1});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.equal( resp.username, "a",
                "Successful login with valid credentials" );
            done1();
        }
    });

    var saveMovie = $.Deferred();
    auth.done(function() {
        // create new movie model in DB
        movie.save(null, {
            wait: true,
            success: function (model, resp) {
                assert.notEqual( resp._id, undefined,
                    "Saving new model succeeds when authenticated" );
                saveMovie.resolve();
                done2();
            }
        });
    });
    var saveMovieAgain = $.Deferred();
    auth.done(function() {
        // create new movie model in DB
        movie.save(null, {
            error: function (model, error) {
                assert.equal( error.status, 500,
                    "Saving with duplicate title-director pairs will be rejected");
                saveMovieAgain.resolve();
                done3();
            }
        });
    });

    // destroy to avoid failure on future test runs
    $.when(auth, saveMovie, saveMovieAgain).then(function() {
        // attempt to delete newly-saved movie
        movie.destroy({
            success: function (model, resp) {
                assert.equal( resp.responseText, "movie deleted",
                    "Deleting returns 200 status code" );
                done4();
            }
        });
    });
});

test("Test movie-delete will remove the associated reviews as well.", function(assert) {
    assert.expect(5 );
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var done4 = assert.async();
    var done5 = assert.async();
    var movie = new splat.Movie({"__v":0,"dated":"2015-10-21T20:44:27.403Z",
        "director":"Shah","duration":109,"freshTotal":18,"freshVotes":27,
        "poster":"img/uploads/5627f969b8236b2b7c0a37b6.jpeg?1448200894795",
        "rating":"R","released":"1999","synopsis":"great thriller",
        "title":"3 Idiots",
        "trailer":"http://archive.org",
        "userid":"54635fe6a1342684065f6959", "genre":["action"],
        "starring":["Bruce Willis,Amy Winemouse"]});  // model
    movie.urlRoot = '/movies';
    // authenticate user with valid credentials
    var user = new splat.User({username:"a", password:"a", login: 1});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.equal( resp.username, "a",
                "Successful login with valid credentials" );
            done1();
        }
    });

    var saveMovie = $.Deferred();
    auth.done(function() {
        // create new movie model in DB
        movie.save(null, {
            wait: true,
            success: function (model, resp) {
                assert.notEqual( resp._id, undefined,
                    "Saving new model succeeds when authenticated" );
                console.log(resp._id);
                movie._id = resp._id;
                console.log(movie);
                saveMovie.resolve();
                done2();
            }
        });
    });

    var review = new splat.Review({'freshness': 1.0,
        'reviewtext': 'Tientien rocks!',
        'reviewname': 'minty',
        'reviewaffil':'zhangmao'});
    var saveReview = $.Deferred();
    $.when(auth, saveMovie).then(function() {
        review.urlRoot = '/movies/'+movie._id +'/reviews';
        console.log("after saveMovie movie id is " + review.urlRoot);
        // review.set({'movieid': movie._id  });
        review.save(null, {
            // wait: true,
            success: function (model, resp) {
                console.log("resp from saveReview is " +resp);
                assert.equal( 1, 1,
                    "Saving review update succeeds when logged in" );
                saveReview.resolve();
                done3();
            }
        });
    });
    // when authentication and saving async calls have completed
    var removeMovie = $.Deferred();
    $.when(auth, saveMovie, saveReview).then(function() {
        // attempt to delete newly-saved movie
        console.log("saveReview ever done?");
        movie.destroy({
            success: function (model, resp) {
                assert.equal( resp.responseText, "movie deleted",
                    "Deleting returns 200 status code" );
                removeMovie.resolve();
                done4();
            }
        });
    });
    $.when(auth, saveMovie, saveReview, removeMovie).then(function() {
        console.log(review.urlRoot + " vs " + movie._id);
        var reviews = new splat.Reviews();  // collection
        console.log(reviews.url);
        reviews.url = '/movies/'+movie._id +'/reviews';
        console.log(reviews.url);
        reviews.fetch({
            success: function(movie, resp) {
                assert.deepEqual( resp, [], "Associated reviews removed" );
                done5();
            }
        });
    });
});

test("Test movie-delete will fail if movie does not exist.", function(assert) {
    assert.expect( 4 );
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var done4 = assert.async();
    var movie = new splat.Movie({"__v":0,"dated":"2015-10-21T20:44:27.403Z",
        "director":"Shah","duration":109,"freshTotal":18,"freshVotes":27,
        "poster":"img/uploads/5627f969b8236b2b7c0a37b6.jpeg?1448200894795",
        "rating":"R","released":"1999","synopsis":"great thriller",
        "title":"Movie Delete Fail",
        "trailer":"http://archive.org",
        "userid":"54635fe6a1342684065f6959", "genre":["action"],
        "starring":["Bruce Willis,Amy Winemouse"]});  // model
    movie.urlRoot = '/movies';

    var user = new splat.User({username:"a", password:"a", login: 1});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.equal( resp.username, "a",
                "Successful login with valid credentials" );
            done1();
        }
    });

    var saveMovie = $.Deferred();
    auth.done(function() {
        // create new movie model in DB
        movie.save(null, {
            wait: true,
            success: function (model, resp) {
                assert.notEqual( resp._id, undefined,
                    "Saving new model succeeds when authenticated" );
                saveMovie.resolve();
                done2();
            }
        });
    });

    // when authentication and saving async calls have completed
    $.when(auth, saveMovie).then(function() {
        // attempt to delete newly-saved movie
        movie.destroy({
            success: function (model, resp) {
                assert.equal( resp.responseText, "movie deleted",
                    "Deleting returns 200 status code" );
                done3();
            }
        });
    });

    $.when(auth, saveMovie).done(function() {
        // attempt to update existing movie
        console.log("auth done");
        movie.destroy({
            error: function (model, resp) {
                assert.equal( resp.status, 404,
                    "Deleting non-existant movie returns 500 status code" );
                done4();
            }
        });
    });

});