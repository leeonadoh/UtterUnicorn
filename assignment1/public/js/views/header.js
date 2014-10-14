var eatz =  eatz || {};

eatz.HeaderView = Backbone.View.extend({

	events : {
		"click" : "selectMenuItem"
	},

    initialize: function () {
		this.render();
    },

    render: function () {
		this.$el.html(this.template());
		return this;
    },
	
	selectMenuItem: function (menuItem) {
		this.$("li").each(function(index) {
			$(this).removeClass("active");
		});
		this.$("#" + $(menuItem.target).attr("id")).parent().addClass("active");
	}

});
