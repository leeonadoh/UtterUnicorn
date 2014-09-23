var eatz =  eatz || {};

eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home"
    },

    initialize: function() {
	this.home;
    },

    home: function() {
        if (!this.homeView) {
            this.homeView = new eatz.HomeView();
        };
        $('#content').html(this.homeView.el);
    }

});

eatz.utils.loadTemplates(['HomeView'], function() {
    app = new eatz.AppRouter();
    Backbone.history.start();
});
