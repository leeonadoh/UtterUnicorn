var eatz =  eatz || {};

eatz.DishesCollection = Backbone.Collection.extend({

    model: eatz.DishModel,
    
    url: "/dishes"
});

eatz.Dishes = new eatz.DishesCollection();