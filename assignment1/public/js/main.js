var eatz =  eatz || {};

eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "about": "about"
    },

    initialize: function() {
	    this.home;
        if (!this.headerView) { 
            this.headerView = new eatz.HeaderView();
        };
        $('#headerContent').html(this.headerView.el);
    },

    home: function() {
        if (!this.homeView) {
            this.homeView = new eatz.HomeView();
        };
        $('#content').html(this.homeView.el);
    },

    about: function() {
        if (!this.aboutView) {  
            this.aboutView = new eatz.AboutView();
        };
        $('#content').html(this.aboutView.el);    
    }

});

eatz.utils.loadTemplates(['HomeView', 'HeaderView', 'AboutView'], function() {
    app = new eatz.AppRouter();
    Backbone.history.start();
});
