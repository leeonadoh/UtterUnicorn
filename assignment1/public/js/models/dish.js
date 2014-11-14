var eatz =  eatz || {};

eatz.DishModel = Backbone.Model.extend({

    idAttribute: "_id",

    defaults: {
        image: "img/placeholder",
        name: "",
        venue: "",
        info: "",
        numbr: "1265",
        street: "Military Trail",
        city: "Scarborough",
        province: "ON",
        website: ""
    }

});