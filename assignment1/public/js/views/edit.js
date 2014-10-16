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

    save: function (menuItem) {
    	if (this.notEmptyFields()) {
    		if (this.did != ""){
    			eatz.Dishes.get(this.did).set(this.newAttributes());
    			eatz.Dishes.get(this.did).save();
    		} else {
	    		var dish = new eatz.DishModel();
		    	dish.set(this.newAttributes());
		    	eatz.Dishes.add(dish);
		    	dish.save();
    		}

	    	//eatz.Dishes.create(this.newAttributes());
	    	//this.addOne(dish);
	    	this.selectMenuItem(menuItem);
    	};
	   	this.resetForms();
    },

    delete: function (menuItem) {
    	this.selectMenuItem(menuItem);
    	this.deleteDish(this.did);
    	this.resetForms();
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

	selectMenuItem: function (menuItem) {
		app.headerView.$("li").each(function(index) {
			$(this).removeClass("active");
		});
		app.headerView.$("a[href$=\"" + $(menuItem.target).attr("href").substring(1)  + "\"]").parent().addClass("active");
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

	setForms: function(dish)
	{
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
		this.did = "";
	},

	editMode: function(id) {
		this.$("#delete").show();
		this.did = id.substring(1);
		console.log(eatz.Dishes.get(this.did));
		this.setForms(eatz.Dishes.get(this.did));
	}

});
