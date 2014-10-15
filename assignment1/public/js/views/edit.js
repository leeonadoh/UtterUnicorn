var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.EditView = Backbone.View.extend({

	events: {
		"click #save": "save",
		"click #delete": "delete"
	},

    initialize: function () {
    	this.$dishName = this.$("#dishName");
    	this.$serverName = this.$("#serverName");
    	this.$info = this.$("#info");
    	this.$webSiteUrl = this.$("#webSiteUrl");
    	this.$addressNumber = this.$("#addressNumber");
    	this.$addressStreet = this.$("#addressStreet");
    	this.$addressCity = this.$("#addressCity");
    	this.$province = this.$("#province");
		this.render();
    },

    render: function () {
		this.$el.html(this.template());  // create DOM content for EditView
		return this;    // support chaining
    },

    save: function (menuItem) {
    	console.log("saving");
    	/*var dish = new eatz.DishModel();
    	dish.set(this.newAttributes());
    	dish.save();
    	eatz.Dishes.add(dish);*/
    	console.log(this.newAttributes());
    	eatz.Dishes.create(this.newAttributes());
    	this.selectMenuItem(menuItem);
    	console.log("saved");
    },

    delete: function (menuItem) {
    	console.log("deleting");
    	this.selectMenuItem(menuItem);
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
    		url: this.$webSiteUrl.val().trim()
    	};
    },

	addOne: function (dish) {
		var view = new eatz.DishView({ model: dish })
    	$('#dish-list').append( view.render().el );
	},

	selectMenuItem: function (menuItem) {
		app.headerView.$("li").each(function(index) {
			$(this).removeClass("active");
		});
		app.headerView.$("a[href$=\"" + $(menuItem.target).attr("href").substring(1)  + "\"]").parent().addClass("active");
	}

});
