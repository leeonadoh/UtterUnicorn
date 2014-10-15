var eatz =  eatz || {};

eatz.DishesCollection = Backbone.Collection.extend({

	model: eatz.DishModel,
	
	localStorage: new Backbone.LocalStorage('eatz')
});

eatz.Dishes = new eatz.DishesCollection();