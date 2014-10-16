var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.EditView = Backbone.View.extend({

	did: "",

	events: {
		"click #save": "save",
		"click #delete": "delete"
	},

    initialize: function () {
    	//this.listenTo(eatz.Dishes, 'add', this.addOne);
		this.render();
    	this.$dishName = this.$("#dishName");
    	this.$serverName = this.$("#serverName");
    	this.$info = this.$("#info");
    	this.$webSiteUrl = this.$("#webSiteUrl");
    	this.$addressNumber = this.$("#addressNumber");
    	this.$addressStreet = this.$("#addressStreet");
    	this.$addressCity = this.$("#addressCity");
    	this.$province = this.$("#province");
    },

    render: function () {
		this.$el.html(this.template());  // create DOM content for EditView
		return this;    // support chaining
    },

    save: function () {
        this.clearErrors();
    	if (this.validate()) {
            console.log("valid input");
    		if (this.did != ""){
                console.log("valid edit");
    			eatz.Dishes.get(this.did).set(this.newAttributes());
    			eatz.Dishes.get(this.did).save();
    		} else {
                console.log("valid add");
	    		var dish = new eatz.DishModel();
		    	dish.set(this.newAttributes());
		    	eatz.Dishes.add(dish);
		    	dish.save();
    		}

	    	//eatz.Dishes.create(this.newAttributes());
	    	//this.addOne(dish);
	    	this.selectBrowseDishes();
            this.resetForms();
            document.location.href = "#dishes";
    	};
    },

    delete: function () {
    	this.selectBrowseDishes();
    	this.deleteDish(this.did);
    	this.resetForms();
        document.location.href = "#dishes";
    },

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

	selectBrowseDishes: function () {
		app.headerView.$("li").each(function(index) {
			$(this).removeClass("active");
		});
		app.headerView.$("#browse").parent().addClass("active");
	},

	resetForms: function() {
		this.$("#dishName").val("");
		this.$("#serverName").val("");
		this.$("#info").val("");
		this.$("#webSiteUrl").val("");
		this.$("#addressNumber").val("");
		this.$("#addressStreet").val("");
		this.$("#addressCity").val("");
		this.$("#province").val("");
	},

	setForms: function(dish){
		this.$("#dishName").val(dish.get("name"));
		this.$("#serverName").val(dish.get("venue"));
		this.$("#info").val(dish.get("info"));
		this.$("#webSiteUrl").val(dish.get("website"));
		this.$("#addressNumber").val(dish.get("numbr"));
		this.$("#addressStreet").val(dish.get("street"));
		this.$("#addressCity").val(dish.get("city"));
		this.$("#province").val(dish.get("province"));
	},

	notEmptyFields: function() {
		return this.$dishName.val().trim() &&
		this.$serverName.val().trim() &&
		this.$info.val().trim() &&
    	this.$addressNumber.val().trim() &&
    	this.$addressStreet.val().trim() &&
    	this.$addressCity.val().trim() &&
    	this.$province.val().trim() &&
		this.$webSiteUrl.val().trim();
	},

	deleteDish: function(dishid){
		console.log(eatz.Dishes.get(dishid));
		console.log(this.did);
		eatz.Dishes.get(dishid).destroy();
	},

	addMode: function() {
		this.$("#delete").hide();
        if(this.did != ""){
            this.resetForms();
        }
		this.did = "";
        this.liveValidate();
	},

	editMode: function(id) {
		this.$("#delete").show();
		this.did = id.substring(1);
		console.log(eatz.Dishes.get(this.did));
		this.setForms(eatz.Dishes.get(this.did));
        this.clearErrors();
        this.liveValidate();
	},

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

    clearErrors: function(){
        this.$(".help-inline").remove();
        this.$(".error").removeClass("error");
    },

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

    validateCity: function(){        
        this.$addressCity.parent().removeClass("error");
        this.$("#cityForm .help-inline").remove();
        if (!/\w/.test(this.$addressCity.val().trim())){
            this.$("#cityForm").append("<span class=\"help-inline\" id=\"error\">Invalid City</span>");
            this.$addressCity.parent().addClass("error");
            return false;
        };
        return true;
    },
    
    validateProvince: function(){        
        this.$province.parent().removeClass("error");
        this.$("#provinceForm .help-inline").remove();
        if (!/\w/.test(this.$province.val().trim())){
                this.$("#provinceForm").append("<span class=\"help-inline\" id=\"error\">Invalid Province</span>");
            this.$province.parent().addClass("error");
            return false;
        };
        return true;
    },

    validateStreet: function(){       
        this.$addressStreet.parent().removeClass("error");
        this.$("#streetForm .help-inline").remove(); 
        if (!/\w/.test(this.$addressStreet.val().trim())){
                this.$("#streetForm").append("<span class=\"help-inline\" id=\"error\">Invalid Street</span>");
            this.$addressStreet.parent().addClass("error");
            return false;
        };
        return true;
    },

    validateStreetNumber: function(){  
        this.$addressNumber.parent().removeClass("error");
        this.$("#numberForm .help-inline").remove();      
        if (!/[0-9][a-zA-Z]?/.test(this.$addressNumber.val().trim())){
                this.$("#numberForm").append("<span class=\"help-inline\" id=\"error\">Invalid Street Number</span>");
            this.$addressNumber.parent().addClass("error");
            return false;
        };
        return true;
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
    }

});
