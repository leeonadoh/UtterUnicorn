var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.BrowseView = Backbone.View.extend({

    initialize: function () {
		this.render();
    },

    render: function () {
		this.$el.html(this.template());  // create DOM content for HomeView
		return this;    // support chaining
    }

});
