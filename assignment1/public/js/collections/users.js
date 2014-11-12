var eatz =  eatz || {};

eatz.UsersCollection = Backbone.Collection.extend({
    model: eatz.UserModel,
});

eatz.Users = new eatz.UsersCollection();