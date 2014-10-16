var eatz =  eatz || {};

eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "about": "about",
        "dishes": "browse",
        "dishes/add": "add",
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

    add: function() {
        if (!this.editView) {  
            this.editView = new eatz.EditView();
        };
        this.editView.delegateEvents();
        $('#content').html(this.editView.el);
        $('body').attr("class", "");
        this.editView.addMode();    
    },

    browse: function() {
        if (!this.browseView) {  
            this.browseView = new eatz.BrowseView();
        };
        this.browseView.delegateEvents();
        this.browseView.dishsDelegateEvents();
        $('#content').html(this.browseView.el);
        $('body').attr("class", "");    
    },

    edit: function(id) {
        if (!this.editView) {  
            this.editView = new eatz.EditView();
        };
        this.editView.delegateEvents();
        $('#content').html(this.editView.el);
        $('body').attr("class", "");
        this.editView.editMode(id);
    }

});

eatz.utils.loadTemplates(['HomeView', 'HeaderView', 'AboutView', 'EditView', 'BrowseView', 'DishView'], function() {
    app = new eatz.AppRouter();
    Backbone.history.start();
});
