var eatz =  eatz || {};

eatz.DishModel = Backbone.Model.extend({

	localStorage: new Backbone.LocalStorage('eatz'),

	idAttribute: "_id",

	defaults: {
    	name: "",
    	venue: "",
    	info: "",
    	numbr: "1265",
    	street: "Military Trail",
    	city: "Scarborough",
    	province: "ON",
    	url: ""
	}
  
});