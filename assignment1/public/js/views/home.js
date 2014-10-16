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

	selectMenuItem: function (menuItem) {
		app.headerView.$("li").each(function(index) {
			$(this).removeClass("active");
		});
		app.headerView.$("#" + $(menuItem.target).attr("id")).parent().addClass("active");
	}

});
