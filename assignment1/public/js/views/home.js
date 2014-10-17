var eatz =  eatz || {};

// note View-name (HomeView) matches name of template HomeView.html
eatz.HomeView = Backbone.View.extend({

	className: "homePadding",

	events : {
		"click" : "selectMenuItem"
	},

    initialize: function () {
		this.render();
    },

    render: function () {
		this.$el.html(this.template());  // create DOM content for HomeView
		return this;    // support chaining
    },

    //Puts active class in the appropriate header button of headerView for buttons in the homeView
	selectMenuItem: function (menuItem) {
		app.headerView.$("li").each(function(index) {
			$(this).removeClass("active");
		});
		app.headerView.$("#" + $(menuItem.target).attr("id")).parent().addClass("active");
	}

});
