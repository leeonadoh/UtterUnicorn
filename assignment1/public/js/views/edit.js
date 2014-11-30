var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.EditView = Backbone.View.extend({

    //The id attribute of the current Dish in the EditView
    //If the current Dish is not yet created (ie adding) then did is ""
    did: "",
    fileReaderSupported: true,
    geolocationSupported: true,
    image: {},
    imageName: "",

    //Events for clicking save and delete buttons
    events: {
        "click #save": "save",
        "click #delete": "delete",
        "click #useGeolocation": "getCurrentPosition",

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
        this.$geoLocBtn = this.$("#useGeolocation");
        this.$googleMap = this.$("#googleMapContainer");

        // Check for presence of FileReader for comparability.
        // Disable live preview + drag and dropping of files if not present.
        if (typeof window.FileReader === "undefined"){
            this.$dropStatus.html("Your browser does not support drag and drop. " +
                "Use the below browse button instead (The image won't show up - it is expected.)");
            this.$dropStatus.addClass("errorColor");
            this.$dropArea.addClass("notSupported");
            this.fileReaderSupported = false;
        }
        // Hide geolocation button if not offered by browser.
        if (!navigator.geolocation){
            this.$geoLocBtn.addClass("disabled");
            eatz.utils.showNotification("", "Aw shucks.", "Your browser doesn't support geolocation - try using the latest version of chrome or firefox!");
            this.geolocationSupported = false;
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
            dragAndDropArea.css("max-width", "100%");
            dragAndDropArea.css("max-height", "100%");
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
        var self = this;
        console.log("SAVING IMAGE");
        eatz.utils.uploadFile(img, function (res) {
            console.log("IMAGE SAVED");
            console.log(self);
            self.saveModel(res);
        });
    },

    saveModel: function (res){
        var self = this;
        eatz.utils.clearNotifications();
        this.geoGetLatAndLon(function (lnl) { 
            if (self.did != ""){ //Editing a dish
                console.log("valid edit");
                eatz.Dishes.get(self.did).set(self.newAttributes());
                if ( lnl.getElementsByTagName("error").length == 0 ){
                    console.log("addr found");
                    eatz.Dishes.get(self.did).set("lat", lnl.getElementsByTagName("latt")[0].childNodes[0].nodeValue);
                    eatz.Dishes.get(self.did).set("lon", lnl.getElementsByTagName("longt")[0].childNodes[0].nodeValue);
                } else {
                    console.log("addr not found");
                }
                if (res) {
                    eatz.Dishes.get(self.did).set("image", res);
                }
                eatz.Dishes.get(self.did).save(null, {
                    wait: true,
                    success: function (model, res) {
                        document.location.href = "#dishes"; //Redirect page to the DishesView
                        self.$("#save").attr("disabled", false);
                        eatz.utils.showNotification("alert-success", "Ok.", "You've modified your dish.");
                        self.selectBrowseDishes(); //Put active class in the DishesView header button
                        self.resetForms(); //Clear the input fields
                    },
                    error: function(model, err) {
                        self.$("#save").attr("disabled", false);
                        eatz.utils.showNotification("alert-error", "Uh-Oh!", err.responseText);
                        eatz.utils.checkAuth();
                    }
                });
            } else { //Adding a dish
                console.log("valid add");
                var dish = new eatz.DishModel();
                dish.set(self.newAttributes());
                if ( lnl.getElementsByTagName("error").length == 0 ){
                    console.log("addr found");
                    dish.set("lat", lnl.getElementsByTagName("latt")[0].childNodes[0].nodeValue);
                    dish.set("lon", lnl.getElementsByTagName("longt")[0].childNodes[0].nodeValue);
                } else {
                    console.log("addr not found");
                }
                if (res) {
                    dish.set("image", res);
                }
                eatz.Dishes.add(dish);
                dish.save(null, {
                    wait: true,
                    success: function (model, res) {
                        document.location.href = "#dishes"; //Redirect page to the DishesView
                        self.$("#save").attr("disabled", false);
                        eatz.utils.showNotification("alert-success", "Ok.", "You've added a new dish.");
                        self.selectBrowseDishes(); //Put active class in the DishesView header button
                        self.resetForms(); //Clear the input fields
                    },
                    error: function(model, err) {
                        eatz.Dishes.remove(model); // Delete the model instance if failed to sync.
                        self.$("#save").attr("disabled", false);
                        eatz.utils.showNotification("alert-error", "Uh-Oh!", err.responseText);
                        eatz.utils.checkAuth();
                    }
                });
            }
        });

        //eatz.Dishes.create(this.newAttributes());
        //this.addOne(dish);
    },

    //Save the changes to the current Dish or add a new Dish if it doesnt exist yet (ie did == "")
    save: function () {
        this.clearErrors();
        eatz.utils.clearNotifications();
        if (this.validate()) { //Check if fields are valid first
            console.log("valid input");
            this.$("#save").attr("disabled", true);
            if (!$.isEmptyObject(this.image)) {
                this.saveImage(this.image); //uploads the image to the database
            } else {
                this.saveModel();
            };
        };
    },

    //Remove a dish from the collection and remove it's view
    delete: function () {
        var self = this;
        console.log(eatz.Dishes.get(this.did));
        console.log(this.did);
        eatz.utils.clearNotifications();
        eatz.Dishes.get(this.did).destroy({
            wait: true,
            success: function(){
                self.selectBrowseDishes(); //Put active class in the DishesView header button
                self.resetForms(); //Clear the input fields
                document.location.href = "#dishes"; //Redirect page to the DishesView
                eatz.utils.showNotification("alert-success", "Ok.", "You've deleted your dish.");
            },
            error: function(model, err){
                eatz.utils.showNotification("alert-error", "Uh-Oh!", err.responseText);
                eatz.utils.checkAuth();
            }
        });
    },

    //Collects values from fields and packs them into an object
    newAttributes: function() {
        return {
            name: _.escape(this.$dishName.val().trim()),
            venue: _.escape(this.$serverName.val().trim()),
            info: _.escape(this.$info.val().trim()),
            numbr: _.escape(this.$addressNumber.val().trim()),
            street: _.escape(this.$addressStreet.val().trim()),
            city: _.escape(this.$addressCity.val().trim()),
            province: _.escape(this.$province.val().trim()),
            website: _.escape(this.$webSiteUrl.val().trim())
        };
    },

    //Put active class in the DishesView header button
    selectBrowseDishes: function () {
        app.headerView.deactivateMenuItems();
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
        this.image = {};
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

    //Turns on the add mode (ie hide delete button and set did = "")
    addMode: function() {
        this.$("#delete").hide();
        if(this.did != ""){
            this.resetForms();
        }
        this.did = "";
        this.liveValidate();
        this.setMap();
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
        this.setImage();
        // Set long and lat values for 2.2
        console.log(eatz.Dishes.get(this.did).get("lat"));
        console.log(eatz.Dishes.get(this.did).get("lon"));
        this.setMap(eatz.Dishes.get(this.did).get("lat"), eatz.Dishes.get(this.did).get("lon")); 
    },

    setMap: function(lat, lng){
        if (this.mapView){
            this.mapView.setCenter(lat, lng);
            this.mapView.resize();
        } else {
            this.mapView = new eatz.MapView({
                model: new eatz.MapModel({lat:lat, lon:lng}),
            });
        }
        this.$googleMap.html(this.mapView.el);
    },

    getCurrentPosition: function(){
        if(this.geolocationSupported){
            var self = this;
            navigator.geolocation.getCurrentPosition(
                function(pos){
                    self.setMap(pos.coords.latitude, pos.coords.longitude);
                    console.log("Set position " + pos.coords.latitude + ", " + pos.coords.longitude);
                    self.geoSetAddressField(pos.coords.latitude, pos.coords.longitude);
                },
                function(){
                    eatz.utils.showNotification("alert-error", "Uh-Oh!", "We weren't able to capture your location - did you grant us permission to do so? ");
                },
                {
                    enableHighAccuracy: true, 
                    timeout: 10000, 
                    maximumAge: 0 
                }
            );
        }
    },

    geoSetAddressField: function(lat, lon) {
        var self = this;
        $.ajax({
            type: "GET",
            url: "https://geocoder.ca",
            data: {"latt": lat, "longt": lon, "geoit": "XML", "reverse": 1},
            success: function (res) {
                console.log(res);
                console.log(res.getElementsByTagName("city")[0].childNodes[0].nodeValue);
                self.setAddress(res);
            }
        });
    },

    geoGetLatAndLon: function(callback) {
    var fullAddress =  _.escape(this.$addressNumber.val().trim()) + " " +
                       _.escape(this.$addressStreet.val().trim()) + " " +
                       _.escape(this.$addressCity.val().trim()) + " " +
                       _.escape(this.$province.val().trim());
    var self = this;
        $.ajax({
            type: "GET",
            url: "https://geocoder.ca",
            data: {"locate": fullAddress, "geoit": "XML"},
            success: function (res) {
                console.log(res);
                callback(res);
            }
        });
    },

    setAddress: function (res) {
        this.$("#addressCity").val(res.getElementsByTagName("city")[0].childNodes[0].nodeValue);
        this.$("#addressStreet").val(res.getElementsByTagName("staddress")[0].childNodes[0].nodeValue);
        this.$("#addressNumber").val(res.getElementsByTagName("stnumber")[0].childNodes[0].nodeValue);
        this.$("#province").val(res.getElementsByTagName("prov")[0].childNodes[0].nodeValue);
    },
    
    setImage: function() {
        if (eatz.Dishes.get(this.did).get("image") != ("img/placeholder")) {
            this.$("#dragAndDrop").css("background-image", "url(\"../img/uploads/" + eatz.Dishes.get(this.did).get("image") + "240x180.png\")");
            this.$("#dragAndDrop").css("background-repeat", "no-repeat"); 
            this.$("#dragAndDrop").css("background-position", "center" );
        }    
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
        if (!eatz.utils.isWord(this.$dishName.val().trim())){
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
        if (!eatz.utils.isWord(this.$serverName.val().trim())){
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
        if (!eatz.utils.isWord(this.$info.val().trim())){
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
        if (!eatz.utils.isValidURL(this.$webSiteUrl.val().trim()) &&
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
        if (!eatz.utils.isWord(this.$addressCity.val().trim())){
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
        if (!eatz.utils.isWord(this.$province.val().trim())){
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
        if (!eatz.utils.isWord(this.$addressStreet.val().trim())){
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
