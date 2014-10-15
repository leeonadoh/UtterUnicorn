var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.BrowseView = Backbone.View.extend({

    initialize: function () {
    	//this.listenTo(eatz.Dishes, 'all', this.fill());
    	//this.listenTo(eatz.Dishes, 'all', this.render());
    	this.render();
    	this.listenTo(eatz.Dishes, "all", function(){
    		console.log(eatz.Dishes);
    		this.delegateEvents();
    	});
    },

    render: function () {
		this.$el.html(this.template());  // create DOM content for HomeView
		return this;    // support chaining
    },


});
