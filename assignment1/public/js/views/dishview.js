var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.DishView = Backbone.View.extend({

	tagName: "div",
    className: "span4 dishTile",
	tagName: 'div class=span3',

    initialize: function () {
		this.render();
    	this.listenTo(this.model, 'destroy', this.remove);
    	this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
		this.$el.html(this.template( this.model.attributes ));  // create DOM content for EditView
		return this;    // support chaining
    },

    updateView: function() {
    	this.$("#dish").attr("href", "#dishes/:" + this.model.id);
    	console.log("href has been changed to: " + "#dishes/:" + this.model.id);
    },

    changePage: function() {
    	document.location.href = "#dishes/:" + this.model.id;
    }

});
