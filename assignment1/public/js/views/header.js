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
    
    //Puts active class in the menuItem of header
    selectMenuItem: function (menuItem) {
        this.$("li").each(function(index) {
            $(this).removeClass("active");
        });
        this.$("#" + $(menuItem.target).attr("id")).parent().addClass("active");
    }

});
