var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.DishView = Backbone.View.extend({
    /*
    events: {
        "click": "changePage"
    },*/

    tagName: "a",
    className: "span4 dishViewThumb",
    id: "dish",

    initialize: function () {
        this.render();
        this.setBackground();
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'change', this.setBackground);
    },

    render: function () {
        this.$el.html(this.template( this.model.attributes ));  // create DOM content for EditView
        this.$el.attr("href", "#dishes/:" + this.model.id);
        return this;    // support chaining
    },
    
    setBackground: function () {
    	  if (this.model.get("image") != "img/placeholder")
    	  {
            console.log("url(\"../img/uploads/" + this.model.get("image") + "360x270.png\")");
        		this.$el.css("background", "url(\"../img/uploads/" + this.model.get("image") + "360x270.png\")"); 
        		this.$el.css("background-repeat", "no-repeat");
        		this.$el.css("background-position", "center" );
    	  }
    }

    //not used
    /*
    updateView: function() {
        this.$("#dish").attr("href", "#dishes/:" + this.model.id);
        console.log("href has been changed to: " + "#dishes/:" + this.model.id);
    },*/

    //Redirect to the edit view of this dish
    // Not used
    /*changePage: function() {
        document.location.href = "#dishes/:" + this.model.id;
    }*/

});
