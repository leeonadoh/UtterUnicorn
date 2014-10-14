var eatz =  eatz || {};

eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "about": "about",
        "edit": "edit",
        "dishes": "browse",
        "dishes/:id": "edit"
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
    },

    edit: function() {
        if (!this.editView) {  
            this.editView = new eatz.EditView();
        };
        $('#content').html(this.editView.el);    
    },

    browse: function() {
        if (!this.browseView) {  
            this.browseView = new eatz.BrowseView();
        };
        $('#content').html(this.browseView.el);    
    }

});

eatz.utils.loadTemplates(['HomeView', 'HeaderView', 'AboutView', 'EditView', 'BrowseView'], function() {
    app = new eatz.AppRouter();
    Backbone.history.start();
});
