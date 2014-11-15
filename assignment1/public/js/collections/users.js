var eatz =  eatz || {};

eatz.UsersCollection = Backbone.Collection.extend({
    model: eatz.UserModel,

    localStorage: new Backbone.LocalStorage('users')
});

eatz.Users = new eatz.UsersCollection();