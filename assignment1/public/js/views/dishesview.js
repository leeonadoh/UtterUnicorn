var eatz =  eatz || {};

eatz.DishesView = Backbone.View.extend({

    //An array of all DishViews
	dishViews : [],

    //Events
	events : {
		"click #dish" : "clearHeader"
	},

    initialize: function () {
    	//this.listenTo(eatz.Dishes, 'all', this.fill());
    	//this.listenTo(eatz.Dishes, 'all', this.render());
		this.render();
    	this.loadCollection();
        //Listen to the Dishes collection for adding models
    	this.listenTo(eatz.Dishes, "add", function(){
    		console.log(eatz.Dishes);
    		this.addNew();
    	});
    	console.log("browse view ready to listen");
    },

    render: function () {
		this.$el.html(this.template());  // create DOM content for DishesView
		this.delegateEvents();
		return this;    // support chaining
    },

    //Add the DishView of the latest Dish in the Dishes collection to the DishesView
    addNew: function () {
    	var view = new eatz.DishView({
    		model: eatz.Dishes.at(eatz.Dishes.length - 1)
    	});
    	this.dishViews.push(view);
    	console.log(view.model.id);
    	console.log("adding");
    	this.$("#dish-list").append(view.render().el);
    	console.log("success");
    	console.log(view.model.id);
    },

    //Add DishView of dish to the DishesView
    addOne: function (dish) {
    	var view = new eatz.DishView({
    		model: dish
    	});
    	this.dishViews.push(view);
    	this.$("#dish-list").append(view.render().el);
    	console.log("success");
    },


    //Fetches the Dishes collection from LocalStorage and adds all DishView to DishesView
    loadCollection: function () {
    	eatz.Dishes.fetch();
    	this.addAll();
    	console.log("Load finished");
    },

    //Empty the DishesView page and add all DishViews from Dishes collection into the page
    addAll: function() {
    	this.$('#dish-list').html('');
    	eatz.Dishes.each(this.addOne, this);
  	}, 

    //Removes active class from all header buttons
	clearHeader: function () {
		app.headerView.$("li").each(function(index) {
			$(this).removeClass("active");
		});
	},

    //applys delegateEvents() for all DishViews
	dishsDelegateEvents: function() {
		this.dishViews.forEach(function (dishV){
			dishV.delegateEvents();
		});
	}



});
