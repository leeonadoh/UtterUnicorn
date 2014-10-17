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
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
        this.$el.html(this.template( this.model.attributes ));  // create DOM content for EditView
        this.$el.attr("href", "#dishes/:" + this.model.id)
        return this;    // support chaining
    },

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
