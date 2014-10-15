var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.DishView = Backbone.View.extend({

	tagName: 'div class=span6',

    initialize: function () {
		this.render();
    },

    render: function () {
		this.$el.html(this.template( this.model.attributes ));  // create DOM content for EditView
		return this;    // support chaining
    }

});
