var eatz =  eatz || {};

eatz.DishModel = Backbone.Model.extend({

    idAttribute: "_id",
    image: "img/placeholder",

    defaults: {
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