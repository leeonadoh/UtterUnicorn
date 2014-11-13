var eatz =  eatz || {};

eatz.EditAccView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    addMode: function() {
        this.$(".accountItem").hide();
        this.$(".signUpItem").show();
    },

    editMode: function() {
        this.$(".accountItem").show();
        this.$(".signUpItem").hide();
    }

});