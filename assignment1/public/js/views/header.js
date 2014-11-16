var eatz =  eatz || {};

eatz.HeaderView = Backbone.View.extend({

    className: "navbar-inner",

    events : {
        "click #btnLogin": "executeLogin"
        "click" : "selectMenuItem"
    },

    initialize: function () {
        this.render();
        this.$signInMenu = this.$("#menuLogin");
        this.$accountMenu = this.$("#menuAccount");
        this.$accountDependantText = this.$("#accountDependant");
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    showSignIn: function(){
        this.$accountMenu.hide();
        this.$signInMenu.show();
    },

    showAccount: function(accountName){
        this.$accountDependantText.text("Logged in as " + accountName);
        this.$signInMenu.hide();
        this.$accountMenu.show();
    },
    
    //Puts active class in the menuItem of header
    selectMenuItem: function (menuItem) {
        this.deactivateMenuItems();
        this.$(menuItem.target).closest(".navItem").addClass("active");
    },

    deactivateMenuItems: function(){
        this.$(".navItem").each(function(index) {
            $(this).removeClass("active");
        });
    },

    executeLogin: function(){
        // Validate locally first.
        // Then execute login.
    }
});
