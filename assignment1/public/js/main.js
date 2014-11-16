var eatz =  eatz || {};

eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "about": "about",
        "dishes": "browse",
        "dishes/add": "add",
        "dishes/:id": "edit",
        "signUp": "addAccount",
        "editAccount": "editAccount"
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
        if (!this.editAccView) {  
            this.editAccView = new eatz.EditAccView();
        };
        $('#content').html(this.editAccView.el);    
        $('body').attr("class", "");
        this.editAccView.addMode();
    },

    editAccount: function() {
        if (!this.editAccView) {  
            this.editAccView = new eatz.EditAccView();
        };
        $('#content').html(this.editAccView.el);    
        $('body').attr("class", "");
        this.editAccView.editMode();
    }

});

eatz.utils.loadTemplates(['HomeView', 'HeaderView', 'AboutView', 'EditView', 'DishesView', 'DishView', "EditAccView"], function() {
    app = new eatz.AppRouter();
    eatz.Dishes.fetch();// Fetch dishes from local storage.
    Backbone.history.start();
});
