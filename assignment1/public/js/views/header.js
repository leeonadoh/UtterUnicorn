var eatz =  eatz || {};

eatz.HeaderView = Backbone.View.extend({

    className: "navbar-inner",

    events : {
        "click #btnLogin": "executeLogin",
        "click #btnLogoff": "executeLogoff",
        "click" : "selectMenuItem",
    },

    initialize: function () {
        this.render();
        this.$signInMenu = this.$("#menuLogin");
        this.$accountMenu = this.$("#menuAccount");
        this.$accountDependantText = this.$("#accountDependant");

        this.$username = this.$("#username");
        this.$password = this.$("#password");
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    showSignIn: function(){
        this.$accountMenu.hide();
        this.$signInMenu.show();
    },

    showAccount: function(accountName){
        this.$accountDependantText.text("Logged in as " + accountName);
        this.$signInMenu.hide();
        this.$accountMenu.show();
        this.$username.val("");
        this.$password.val("");
    },
    
    //Puts active class in the menuItem of header
    selectMenuItem: function (menuItem) {
        this.deactivateMenuItems();
        this.$(menuItem.target).closest(".navItem").addClass("active");
    },

    deactivateMenuItems: function(){
        this.$(".navItem").each(function(index) {
            $(this).removeClass("active");
        });
    },

    validateCridentials: function(){ // TODO notifications
        var valid = true;
        if (!eatz.utils.isWord(this.$username.val().trim())){
            console.log("Invalid username.") // Switch to notifications.
            valid = false;
        }
        if (!eatz.utils.isWord(this.$password.val())){//Allow blank spaces in password?
            console.log("Invalid password.") // Switch to notifications.
            valid = false;
        }
        return valid;
    },

    fetchCridentials: function(isLogIn){
        return {
            username: this.$username.val().trim(),
            password: this.$password.val(),
            login: isLogIn && true,
        };
    },

    executeLogin: function(){ // TODO notifications
        // Validate locally first.
        if (!this.validateCridentials()){
            return;
        }
        // Then execute login.
        $.ajax({
            url: '/auth',
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(this.fetchCridentials(true)),
            success: function(res){
                if (res.error){
                    console.log('Sign in failed');
                } else {
                    // Show notification of login
                    console.log('Welcome ' + res.username);
                    console.log(res);
                    app.headerView.showAccount(res.username);
                    app.headerView.$signInMenu.removeClass("open");
                    app.headerView.deactivateMenuItems();
                    document.location.href = "#";
                }
            },
            error: function(err){
                console.log(err.responseText);
            }
        });
    },

    executeLogoff: function(e){ // TODO notifications
        e.preventDefault();
        $.ajax({
            url: '/auth',
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(this.fetchCridentials(false)),
            success: function(res){
                if (res.error){
                    console.log('Log off failed');
                } else {
                    // Show notification of log off
                    console.log("You have logged off.");
                    console.log(res);
                    app.headerView.showSignIn();
                    app.headerView.$accountMenu.removeClass("open");
                    app.headerView.deactivateMenuItems();
                    document.location.href = "#";
                }
            },
            error: function(err){
                console.log(err.responseText);
            }
        });
    },

});
