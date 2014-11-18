var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.DishView = Backbone.View.extend({
    /*
    events: {
        "click": "changePage"
    },*/

    tagName: "div",
    className: "span4",
    id: "dish",

    initialize: function () {
        this.render();
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'change', this.setBackground);
    },

    render: function () {
        this.$el.html(this.template( this.model.attributes ));  // create DOM content for EditView
        this.setBackground();
        return this;    // support chaining
    },
    
    setBackground: function () {
    	  if (this.model.get("image") != "img/placeholder"){
            console.log("url(\"../img/uploads/" + this.model.get("image") + "360x270.png\")");
            this.$(".dishViewThumb").css("background-image", "url(\"../img/uploads/" + this.model.get("image") + "360x270.png\")"); 
            console.log("Modified thumbnail");
    		//this.$(".dishViewThumb").css("background-repeat", "no-repeat");
    		//this.$(".dishViewThumb").css("background-position", "center" );
    	}
    }

});
