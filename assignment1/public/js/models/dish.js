var eatz =  eatz || {};

eatz.DishModel = Backbone.Model.extend({

	idAttribute: "_id",
    id: "",

	defaults: {
    	name: "",
    	venue: "",
    	info: "",
    	numbr: "1265",
    	street: "Military Trail",
    	city: "Scarborough",
    	province: "ON",
    	website: ""
	},
  
});