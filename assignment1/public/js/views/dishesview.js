var eatz =  eatz || {};

eatz.DishesView = Backbone.View.extend({

    //An array of all DishViews
    dishViews : [],

    //Events
    events : {
        "click #dish" : "clearHeader"
    },

    initialize: function () {
        //this.listenTo(eatz.Dishes, 'all', this.fill());
        //this.listenTo(eatz.Dishes, 'all', this.render());
        this.render();
        this.loadCollection();
        //Listen to the Dishes collection for adding models
        this.listenTo(eatz.Dishes, "add:newDish", function(){
            console.log("browse view listend to new Dish.");
            this.sortDishes("name");
        });        
        this.listenTo(eatz.Dishes, "sort:name", function(){
            console.log("event listened: name");
            this.sortDishes("name");
        });        
        this.listenTo(eatz.Dishes, "sort:venue", function(){
            console.log("event listened: venue");
            this.sortDishes("venue");
        });
        console.log("browse view ready to listen");
    },

    render: function () {
        this.$el.html(this.template());  // create DOM content for DishesView
        this.delegateEvents();
        return this;    // support chaining
    },

    //Add DishView of dish to the DishesView
    addOne: function (dish) {
        var view = new eatz.DishView({
            model: dish
        });
        this.dishViews.push(view);
        this.$("#dish-list").append(view.render().el);
        console.log("success");
    },


    //Adds all DishView to DishesView
    loadCollection: function () {
        this.addAll();
        console.log("Load finished");
    },

    //Empty the DishesView page and add all DishViews from Dishes collection into the page
    addAll: function() {
        this.$('#dish-list').html('');
        eatz.Dishes.each(this.addOne, this);
    }, 

    //Removes active class from all header buttons
    clearHeader: function () {
        app.headerView.$("li").each(function(index) {
            $(this).removeClass("active");
        });
    },

    //applys delegateEvents() for all DishViews
    dishsDelegateEvents: function() {
        this.dishViews.forEach(function (dishV){
            dishV.delegateEvents();
        });
    },

    sortDishes: function (value) {
        eatz.Dishes.comparator = value;
        eatz.Dishes.sort();
        this.render();
        this.loadCollection();
    }

});
