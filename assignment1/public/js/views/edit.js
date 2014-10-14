var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.EditView = Backbone.View.extend({

	events: {
		"click #save": "save",
		"click #delete": "delete",
	},

    initialize: function () {
    	 this.listenTo(this, 'change', this.change);
		this.render();
    },

    render: function () {
		this.$el.html(this.template());  // create DOM content for EditView
		return this;    // support chaining
    },

    save: function () {
    	console.log("saving");
    },

    delete: function () {
    	console.log("deleting");
    }



});
