var splat =  splat || {};

splat.Edit = Backbone.View.extend({

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
        console.log(this);
        this.$el.html(this.template(this.model.toJSON()));
        return this;    // support chaining
    },
    inputChange: function (event){
        // if change input event is found, try to validate new input value
        var field_name = event.target.id;
        var field_value = event.target.value;
        this.validateField(field_name, field_value);
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
        event.preventDefault(); //prevent default handler
        event.stopPropagation();
        //destroy current dish model and navigate to browse view on success
        this.model.destroy({
            success: function(model, response){
                splat.app.navigate("movies", {trigger: true, replace: true});
            }});
    },
    saveMovie: function (event) {
        event.preventDefault();
        event.stopPropagation();
        var hasError = false;
        //console.log(this.model.validators);

        //validate all fields in temporary dish model with validators of model
        for (var key in this.model.validators){
            console.log(key)
            //if there's error found set hasError to true
            if (!(this.validateField(key, this.tempModel[key]))){
                hasError = true;
            }
        }
        //if no error found then proceed to save values in temporary dish model
        //to the dish model
        if (!hasError){
            var idUrl = this.tempModel.title+this.tempModel.director;
            this.model.set({'_id': idUrl}); //set dish id(url)
            this.addMovie(); //add and save to collection
        }
    },
    addMovie: function (){
        var url = this.tempModel["_id"];
        splat.movies.add(this.model); //add model to collection
        //save values in temporary dish model to the current dish model
        this.model.save(this.tempModel, {
            wait:true,
            success: function(movie, response){
                //navigate to new url on success
                splat.app.navigate("movies/" + url, {trigger:true});
            },
            error: function(movie, response) {
            }
        });
    },
    dragImg: function(event){
        event.preventDefault();
        event.stopPropagation();
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
        var pictureFile = event.target.files[0];
        this.readImg(pictureFile);
    },
    readImg: function(file){
        var imgTag = this.$el.find("img");
        var reader = new FileReader();
        reader.onload = function () {
            imgTag.attr("src", reader.result);
        };
        reader.readAsDataURL(file);
    }
});
