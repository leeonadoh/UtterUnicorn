var eatz =  eatz || {};

eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "about": "about",
        "dishes": "browse",
        "dishes/add": "add",
        "dishes/:id": "edit",
        "signUp": "addAccount",
    },

    initialize: function() {
        this.home;
        if (!this.headerView) { 
            this.headerView = new eatz.HeaderView();
        };
        this.headerView.delegateEvents()
        $('#headerContent').html(this.headerView.el);
        eatz.utils.checkAuth();
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
        this.aboutView.delegateEvents();
        $('#content').html(this.aboutView.el);    
        $('body').attr("class", "");
    },

    add: function() {
        if (!this.editView) {  
            this.editView = new eatz.EditView();
        };
        $('#content').html(this.editView.el);
        $('body').attr("class", "");
        this.editView.addMode();    
        this.editView.delegateEvents();
    },

    browse: function() {
        if (!this.dishesView) {  
            this.dishesView = new eatz.DishesView();
        };
        this.dishesView.delegateEvents();
        this.dishesView.dishsDelegateEvents();
        $('#content').html(this.dishesView.el);
        $('body').attr("class", "");    
    },

    edit: function(id) {
        if (!this.editView) {  
            this.editView = new eatz.EditView();
        };
        $('#content').html(this.editView.el);
        $('body').attr("class", "");
        this.editView.editMode(id);
        this.editView.delegateEvents();
    },

    addAccount: function() {
        if (!this.newAccView) {  
            this.newAccView = new eatz.NewAccView();
        }
        $('#content').html(this.newAccView.el);    
        $('body').attr("class", "");
        // Reset forms
        this.newAccView.clearEntries();
        this.newAccView.clearErrors();
        this.newAccView.delegateEvents();
    },

});

eatz.utils.loadTemplates(['HomeView', 'HeaderView', 'AboutView', 'EditView', 'DishesView', 'DishView', "NewAccView", "MapView"], function() {
    app = new eatz.AppRouter();
    eatz.Dishes.fetch({
        success: function(){
            eatz.Dishes.trigger("sort:name");
        },
        error: function(){
            eatz.utils.showNotification("alert-error", "Uh-Oh!", " We couldn't load the dishes - try refreshing the page.");
        }
    });// Fetch dishes from local storage.
    Backbone.history.start();
});
