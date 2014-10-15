var eatz =  eatz || {};

eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "about": "about",
        "dishes": "browse",
        "dishes/add": "edit",
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
        this.homeView.delegateEvents();
        $('#content').html(this.homeView.el);
        $('body').attr("class", "homeBackground");
    },

    about: function() {
        if (!this.aboutView) {  
            this.aboutView = new eatz.AboutView();
        };
        $('#content').html(this.aboutView.el);    
        $('body').attr("class", "");
    },

    edit: function() {
        if (!this.editView) {  
            this.editView = new eatz.EditView();
        };
        this.editView.delegateEvents();
        $('#content').html(this.editView.el);
        $('body').attr("class", "");    
    },

    browse: function() {
        if (!this.browseView) {  
            this.browseView = new eatz.BrowseView();
        };
        this.browseView.delegateEvents();
        $('#content').html(this.browseView.el);
        $('body').attr("class", "");    
    }

});

eatz.utils.loadTemplates(['HomeView', 'HeaderView', 'AboutView', 'EditView', 'BrowseView', 'DishView'], function() {
    app = new eatz.AppRouter();
    Backbone.history.start();
});
