var eatz =  eatz || {};

eatz.DishesView = Backbone.View.extend({

    geolocationSupported: true,
    //An array of all DishViews
    dishViews : [],

    //Events
    events : {
        "click #dish" : "clearHeader"
    },

    initialize: function () {
        var self = this;
        //this.listenTo(eatz.Dishes, 'all', this.fill());
        //this.listenTo(eatz.Dishes, 'all', this.render());
        this.render();
        this.loadCollection();
        //Listen to the Dishes collection for adding models
        this.listenTo(eatz.Dishes, "sync", function(){
            console.log("browse view listend to add dish.");
            self.sortDishes("name");
        });        
        this.listenTo(eatz.Dishes, "sort:name", function(){
            console.log("event listened: name");
            self.sortDishes("name");
        });        
        this.listenTo(eatz.Dishes, "sort:venue", function(){
            console.log("event listened: venue");
            self.sortDishes("venue");
        });       
        this.listenTo(eatz.Dishes, "sort:distance", function(){
            console.log("event listened: distance");
            self.sortDishes("distance");
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
        //console.log(dish);
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
        if (value == "distance") {
            console.log("Sorting by distance");
            var self = this;
            navigator.geolocation.getCurrentPosition(function(pos) {
                eatz.Dishes.comparator = function (a, b) {
                    var alatd = a.get("lat") - pos.coords.latitude;
                    var alond = a.get("lon") - pos.coords.longitude;
                    var adist = Math.pow(Math.pow(alatd, 2) + Math.pow(alond, 2), 1/2);
                    var blatd = b.get("lat") - pos.coords.latitude;
                    var blond = b.get("lon") - pos.coords.longitude;
                    var bdist = Math.pow(Math.pow(blatd, 2) + Math.pow(blond, 2), 1/2);
                    if (adist < bdist) {
                        return -1;
                    } else if (adist > bdist) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
                eatz.Dishes.sort();
                self.render();
                self.loadCollection();
            });
        } else {
            console.log("Sorting");
            eatz.Dishes.comparator = value;
            eatz.Dishes.sort();
            this.render();
            this.loadCollection();
        }
    }

});
