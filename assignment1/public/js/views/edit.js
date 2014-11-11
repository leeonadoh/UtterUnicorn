var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.EditView = Backbone.View.extend({

    //The id attribute of the current Dish in the EditView
    //If the current Dish is not yet created (ie adding) then did is ""
    did: "",
    fileReaderSupported: true,
    image: {},

    //Events for clicking save and delete buttons
    events: {
        "click #save": "save",
        "click #delete": "delete",

        "dragenter #dragAndDrop": "onDragEnter",
        "dragleave #dragAndDrop": "onDragLeave",
        "dragover #dragAndDrop": "onDragOver",
        "drop #dragAndDrop": "onDragDrop",

        "click #browseBtn": "clickHiddenBrowse",
        "change #hiddenBrowse": "loadPicFromBrowse"
    },

    initialize: function () {
        //this.listenTo(eatz.Dishes, 'add', this.addOne);
        this.render();
        //naming doms
        this.$dishName = this.$("#dishName");
        this.$serverName = this.$("#serverName");
        this.$info = this.$("#info");
        this.$webSiteUrl = this.$("#webSiteUrl");
        this.$addressNumber = this.$("#addressNumber");
        this.$addressStreet = this.$("#addressStreet");
        this.$addressCity = this.$("#addressCity");
        this.$province = this.$("#province");
        this.$dropArea = this.$("#dragAndDrop");
        this.$dropStatus = this.$("#statusText");
        this.$hiddenBrowseBtn = this.$("#hiddenBrowse");
        this.$browseBtn = this.$("#browseBtn");

        // Check for presence of FileReader for comparability.
        // Disable live preview + drag and dropping of files if not present.
        if (typeof window.FileReader === "undefined"){
            this.$dropStatus.html("Your browser does not support drag and drop. " +
                "Use the below browse button instead (The image won't show up - it is expected.)");
            this.$dropStatus.addClass("errorColor");
            this.$dropArea.addClass("notSupported");
            this.fileReaderSupported = false;
        }
    },

    // Delegates clicks on the browse button to the hidden, ugly looking 
    // browse input field.
    clickHiddenBrowse: function(){
        this.$hiddenBrowseBtn.click();
    },

    // Detects changes of the browse input field value, and attempts to load
    // the specified file for live preview.
    loadPicFromBrowse: function(e){
        if (this.fileReaderSupported){
            var file = e.target.files[0];
            console.log(file);
            this.loadImageToView(file);
        }
    },

    // Fired when a file is dragged over the drop zone.
    onDragOver: function(ev) { 
        ev.preventDefault(); 
    },

    // Fired when a file has been detected over the drop zone.
    onDragEnter: function(){
        if (this.fileReaderSupported){
            this.$dropArea.addClass("hover");
        }
    },

    // Fired when a file has left the drop zone.
    onDragLeave: function(){
        if (this.fileReaderSupported){
            this.$dropArea.removeClass("hover");
        }
    },

    // When an item is dropped in the drop zone.
    onDragDrop: function(e){
        if (this.fileReaderSupported){
            // Prevent browse from doing its default behavior.
            e.preventDefault();
            e.stopPropagation();
            this.$dropArea.removeClass("hover");
            // Retrieve file from the drop transfer
            var file = e.originalEvent.dataTransfer.files[0];
            // Test to see if image file. Load it to live preview if valid.
            // Display error message if not.
            if (!/image\/.*/.test(file.type)){
                this.$dropStatus.html("Please drag and drop a image file.");
                this.$dropStatus.addClass("error");
            } else {
                this.loadImageToView(file);
            }
        }
    },

    // Load the specified image file to the drag and drop / preview area.
    loadImageToView: function(imageFile){
        var reader = new window.FileReader();
        var dragAndDropArea = this.$dropArea;

        this.$dropStatus.html("");
        this.$dropStatus.removeClass("error");
        // Callback to change the background image of the preview window.
        reader.onload = function (event) {
            console.log(event.target);
            dragAndDropArea.css("background-image", "url(" + event.target.result + ")");
        };
        reader.readAsDataURL(imageFile);
        this.image = imageFile;
    },

    render: function () {
        this.$el.html(this.template());  // create DOM content for EditView
        return this;    // support chaining
    },

    saveImage: function (img) {
        eatz.utils.uploadFile(img);
    },

    //Save the changes to the current Dish or add a new Dish if it doesnt exist yet (ie did == "")
    save: function () {
        this.clearErrors();
        if (this.validate()) { //Check if fields are valid first
            console.log("valid input");
            this.saveImage(this.image); //uploads the image to the database
            if (this.did != ""){ //Editing a dish
                console.log("valid edit");
                eatz.Dishes.get(this.did).set(this.newAttributes());
                eatz.Dishes.get(this.did).save();
            } else { //Adding a dish
                console.log("valid add");
                var dish = new eatz.DishModel();
                dish.set(this.newAttributes());
                eatz.Dishes.add(dish);
                dish.save();
                eatz.Dishes.trigger("add:newDish");
            }

            //eatz.Dishes.create(this.newAttributes());
            //this.addOne(dish);
            this.selectBrowseDishes(); //Put active class in the DishesView header button
            this.resetForms(); //Clear the input fields
            document.location.href = "#dishes"; //Redirect page to the DishesView
        };
    },

    //Remove a dish from the collection and remove it's view
    delete: function () {
        this.selectBrowseDishes(); //Put active class in the DishesView header button
        this.deleteDish(this.did); //Destroy dish model
        this.resetForms(); //Clear the input fields
        document.location.href = "#dishes"; //Redirect page to the DishesView
    },

    //Collects values from fields and packs them into an object
    newAttributes: function() {
        return {
            name: this.$dishName.val().trim(),
            venue: this.$serverName.val().trim(),
            info: this.$info.val().trim(),
            numbr: this.$addressNumber.val().trim(),
            street: this.$addressStreet.val().trim(),
            city: this.$addressCity.val().trim(),
            province: this.$province.val().trim(),
            website: this.$webSiteUrl.val().trim()
        };
    },

    //Put active class in the DishesView header button
    selectBrowseDishes: function () {
        app.headerView.$("li").each(function(index) {
            $(this).removeClass("active");
        });
        app.headerView.$("#browse").parent().addClass("active");
    },

    //Clear the input fields
    resetForms: function() {
        this.$("#dishName").val("");
        this.$("#serverName").val("");
        this.$("#info").val("");
        this.$("#webSiteUrl").val("");
        this.$("#addressNumber").val("");
        this.$("#addressStreet").val("");
        this.$("#addressCity").val("");
        this.$("#province").val("");
        this.$dropArea.removeAttr("style");
        this.$hiddenBrowseBtn.val("");
    },

    //Sets the input fields to match the values of the Dish being edited
    setForms: function(dish){
        this.$("#dishName").val(dish.get("name"));
        this.$("#serverName").val(dish.get("venue"));
        this.$("#info").val(dish.get("info"));
        this.$("#webSiteUrl").val(dish.get("website"));
        this.$("#addressNumber").val(dish.get("numbr"));
        this.$("#addressStreet").val(dish.get("street"));
        this.$("#addressCity").val(dish.get("city"));
        this.$("#province").val(dish.get("province"));
        // This will be replaced with the saved image later on.
        this.$dropArea.removeAttr("style");
        this.$hiddenBrowseBtn.val("");
    },

    //not used
    /*
    notEmptyFields: function() {
        return this.$dishName.val().trim() &&
        this.$serverName.val().trim() &&
        this.$info.val().trim() &&
        this.$addressNumber.val().trim() &&
        this.$addressStreet.val().trim() &&
        this.$addressCity.val().trim() &&
        this.$province.val().trim() &&
        this.$webSiteUrl.val().trim();
    },*/

    //Destroy the dish model
    deleteDish: function(dishid){
        console.log(eatz.Dishes.get(dishid));
        console.log(this.did);
        eatz.Dishes.get(dishid).destroy();
    },

    //Turns on the add mode (ie hide delete button and set did = "")
    addMode: function() {
        this.$("#delete").hide();
        if(this.did != ""){
            this.resetForms();
        }
        this.did = "";
        this.liveValidate();
    },

    //Turns on the edit mode (ie shows the delete button and 
    //set did to the id of the Dish model. Also removes any 
    //leftover error messages from the previous dish.)
    editMode: function(id) {
        this.$("#delete").show();
        this.did = id.substring(1);
        console.log(eatz.Dishes.get(this.did));
        this.setForms(eatz.Dishes.get(this.did));
        this.clearErrors();
        this.liveValidate();
    },

    //Checks that all values in the input fields are valid
    validate: function()
    {
        var valid = true;
        valid = this.validateDishName() && valid;
        valid = this.validateVenue() && valid;
        valid = this.validateInfo() && valid;
        valid = this.validateUrl() && valid;
        valid = this.validateStreet() && valid;
        valid = this.validateStreetNumber() && valid;
        valid = this.validateProvince() && valid;
        valid = this.validateCity() && valid;
        return valid;
    },

    //Removes any error messages in the input fields
    clearErrors: function(){
        this.$(".help-inline").remove();
        this.$(".error").removeClass("error");
    },

    //Checks that the dish name input is valid
    validateDishName: function(){
        this.$dishName.parent().removeClass("error");
        this.$("#dishNameForm .help-inline").remove();
        if (!/\w/.test(this.$dishName.val().trim())){
            this.$dishName.parent().addClass("error");
            this.$("#dishNameForm").append("<span class=\"help-inline\" id=\"error\">Invalid Name</span>");
            return false;
        };
        return true;
    },

    //Checks that the venue input is valid
    validateVenue: function(){
        this.$serverName.parent().removeClass("error");
        this.$("#venueForm .help-inline").remove();
        if (!/\w/.test(this.$serverName.val().trim())){
            this.$serverName.parent().addClass("error");
            this.$("#venueForm").append("<span class=\"help-inline\" id=\"error\">Invalid Name</span>");
            return false;
        };
        return true;
    },

    //Checks that the info input is valid
    validateInfo: function(){   
        this.$info.parent().removeClass("error");
        this.$("#infoForm .help-inline").remove();
        if (!/\w/.test(this.$info.val().trim())){
            this.$info.parent().addClass("error");
            this.$("#infoForm").append("<span class=\"help-inline\" id=\"error\">Invalid Info</span>");
            return false;
        };  
        return true;
    },

    //Checks that the website input is valid
    validateUrl: function(){        
        this.$webSiteUrl.parent().removeClass("error");
        this.$("#urlForm .help-inline").remove();
        if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(this.$webSiteUrl.val().trim()) &&
            (this.$webSiteUrl.val().trim())){
            this.$webSiteUrl.parent().addClass("error");
            this.$("#urlForm").append("<span class=\"help-inline\" id=\"error\">Invalid Url</span>");
            return false;
        };
        return true;
    },

    //Checks that the city input is valid
    validateCity: function(){        
        this.$addressCity.parent().removeClass("error");
        this.hideProvWarning();
        if (!/\w/.test(this.$addressCity.val().trim())){
            this.$("#provErrorPrompt").show(); 
            this.$addressCity.parent().addClass("error");
            return false;
        };
        return true;
    },
    
    //Checks that the province input is valid
    validateProvince: function(){        
        this.$province.parent().removeClass("error");
        this.hideProvWarning();
        if (!/\w/.test(this.$province.val().trim())){
            this.$("#provErrorPrompt").show(); 
            this.$province.parent().addClass("error");
            return false;
        };
        return true;
    },

    //Checks that the street input is valid
    validateStreet: function(){       
        this.$addressStreet.parent().removeClass("error");
        this.hideStreetWarning(); 
        if (!/\w/.test(this.$addressStreet.val().trim())){
            this.$("#streetErrorPrompt").show();
            this.$addressStreet.parent().addClass("error");
            return false;
        };
        return true;
    },

    //Checks that the street number input is valid
    validateStreetNumber: function(){  
        this.$addressNumber.parent().removeClass("error");
        this.hideStreetWarning();   
        if (!/[0-9][a-zA-Z]?/.test(this.$addressNumber.val().trim())){
            this.$("#streetErrorPrompt").show();
            this.$addressNumber.parent().addClass("error");
            return false;
        };
        return true;
    },

    //Adds listeners to check if inputs are valid when they lose focus
    hideStreetWarning: function(){
        if (!this.$addressNumber.parent().hasClass("error") && !this.$addressStreet.parent().hasClass("error")){
            this.$("#streetErrorPrompt").hide(); 
        };
    },
    hideProvWarning: function(){
        if (!this.$province.parent().hasClass("error") && !this.$addressCity.parent().hasClass("error")){
            this.$("#provErrorPrompt").hide(); 
        };
    },
    liveValidate: function(){
        console.log("live validation on");
        this.$("#dishName").change($.proxy(this.validateDishName, this));
        this.$("#serverName").change($.proxy(this.validateVenue, this));
        this.$("#info").change($.proxy(this.validateInfo, this));
        this.$("#webSiteUrl").change($.proxy(this.validateUrl, this));
        this.$("#province").change($.proxy(this.validateProvince, this));
        this.$("#addressStreet").change($.proxy(this.validateStreet, this));
        this.$("#addressNumber").change($.proxy(this.validateStreetNumber, this));
        this.$("#addressCity").change($.proxy(this.validateCity, this));
        this.$("#streetErrorPrompt").hide(); 
        this.$("#provErrorPrompt").hide(); 
    }

});
