var eatz =  eatz || {};

eatz.HeaderView = Backbone.View.extend({

    className: "navbar-inner",

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
    
    //Puts active class in the menuItem of header
    selectMenuItem: function (menuItem) {
        this.$(".navItem").each(function(index) {
            $(this).removeClass("active");
        });
        this.$(menuItem.target).closest(".navItem").addClass("active");
    }
});
