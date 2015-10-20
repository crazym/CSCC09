var splat =  splat || {};

splat.Details = Backbone.View.extend({

    events: {
        "change input[type='text']": "inputChange",
        "add": "addMovie",
        "click #moviedel": "deleteMovie",
        "click #moviesave": "saveMovie",
        "change #browse-img": "browseImg",
        "dragover .movie-edit-img": "dragImg",
        "drop": "dropImg"

    },

    initialize: function (options) {
        this.render();
        this.tempModel = options.tempModel;
    },

    render: function () {
        // create DOM content for EditView
        this.$el.html(this.template(this.model.toJSON()));
        return this;    // support chaining
    },

    inputChange: function (event){
        // if change input event is found, try to validate new input value
        var field_name = event.target.id;
        var field_value = event.target.value;

        if (field_name in this.model.validators) {
            this.validateField(field_name, field_value);
        }
        //splat.utils.hideNotice();
        splat.utils.showNotice('info', "Movie attributes updated; to make changes persistent, click \"Save Changes\" button.");
    },

    validateField: function(field_name, field_value){
        //validate name-value pair through model's validators
        var validResult = this.model.validators[field_name](field_value);
        //if the validation failed set error tag and insert inline-help
        if (validResult.isOK == false){
            splat.utils.failValidation(field_name, validResult.errMsg);
        } else { //if the validation passed remove error tag and inline-help
            splat.utils.passValidation(field_name);
        }
        //save value to temporary model
        this.tempModel[field_name] = field_value;
        return validResult.isOK; //return validation result
    },

    deleteMovie: function (event) {
        splat.utils.hideNotice();
        event.preventDefault(); //prevent default handler
        event.stopPropagation();
        //destroy current movie model and navigate to browse view on success
        this.model.destroy({
            success: function(model, response){
                splat.utils.hideNotice();
                splat.utils.showNotice('succ', "Movie deleted, redirsting to browsing page.");
                splat.app.navigate("movies", {trigger: true, replace: true});
            },
            error: function(movie, response) {
                splat.utils.hideNotice();
                splat.utils.showNotice('warning', "Sorry, unable to delete this movie instance.");
            }
        });
    },

    saveMovie: function (event) {
        event.preventDefault();
        event.stopPropagation();
        var hasError = false;

        //validate all fields in temporary movie model with validators of model
        for (var key in this.model.validators){
            //if there's error found set hasError to true
            if (!(this.validateField(key, this.tempModel[key]))){
                hasError = true;
            }
        }
        //if no error found then proceed to save values in temporary movie model
        //to the movie model
        if (!hasError){
            this.addMovie(); //add and save to collection
        }
    },

    addMovie: function (){

        splat.utils.hideNotice();
        //var url = this.tempModel["_id"];
        splat.movies.add(this.model); //add model to collection
        //save values in temporary movie model to the current movie model
        this.model.save(this.tempModel, {
            wait:true,
            success: function(movie, response){
                //display a message on the status-notification panel
                // indicating whether the action succeeded or failed
                splat.utils.hideNotice();
                splat.utils.showNotice('succ', "Congrats! Movie saved.");
            },
            error: function(movie, response) {
                splat.utils.hideNotice();
                splat.utils.showNotice('warning', "Sorry, unable to save movie.");
            }
        });
    },

    // image file select
    dragImg: function(event){
        //event.preventDefault();
        //event.stopPropagation();
        // don't let parent element catch event
        event.stopPropagation();
        // prevent default to enable drop event
        event.preventDefault();
        // jQuery event doesn’t have dataTransfer
        // field - so use originalEvent
        event.originalEvent.dataTransfer.dropEffect = 'copy';
    },

    dropImg: function(event){
        event.preventDefault();
        event.stopPropagation();
        event.originalEvent.dataTransfer.dropEffect = 'copy';
        var pictureFile = event.originalEvent.dataTransfer.files[0];
        this.readImg(pictureFile);
    },

    browseImg: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.pictureFile = event.target.files[0];
        if (this.pictureFile.type.match('image.*')) {
            this.readImg(this.pictureFile);
        }
        // error notification handled in saving the movie action
    },

    readImg: function(file){
        var self = this;
        var reader = new FileReader();
        reader.onload = function (event) {
            var resized = splat.utils.resize(reader.result);
            var targetImgElt = $('.movie-edit-img');
            targetImgElt.attr('src', resized);
            self.tempModel['poster']= resized;
        };
        reader.readAsDataURL(file);
    }
});
