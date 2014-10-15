var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.BrowseView = Backbone.View.extend({

	events : {
		"click #dish" : "clearHeader"
	},

    initialize: function () {
    	//this.listenTo(eatz.Dishes, 'all', this.fill());
    	//this.listenTo(eatz.Dishes, 'all', this.render());
		this.render();
    	this.loadCollection();
    	this.listenTo(eatz.Dishes, "add", function(){
    		console.log(eatz.Dishes);
    		this.addNew();
    	});
    	console.log("browse view ready to listen");
    },

    render: function () {
		this.$el.html(this.template());  // create DOM content for HomeView
		this.delegateEvents();
		return this;    // support chaining
    },

    addNew: function () {
    	var view = new eatz.DishView({
    		model: eatz.Dishes.at(eatz.Dishes.length - 1)
    	});
    	this.$("#dish-list").append(view.render().el);
    	console.log("success");
    },

    addOne: function (dish) {
    	var view = new eatz.DishView({
    		model: dish
    	});
    	this.$("#dish-list").append(view.render().el);
    	console.log("success");
    },

    loadCollection: function () {
    	eatz.Dishes.fetch();
    	this.addAll();
    	console.log("Load finished");
    },

    addAll: function() {
    	this.$('#dish-list').html('');
    	eatz.Dishes.each(this.addOne, this);
  	}, 

	clearHeader: function () {
		app.headerView.$("li").each(function(index) {
			$(this).removeClass("active");
		});
		console.log("cleared");
	}



});
