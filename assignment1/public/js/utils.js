var eatz = eatz || {};

eatz.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (eatz[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    eatz[view].prototype.template = _.template(data);
                }));
            } else {
                console.log(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    uploadFile: function (file, callback) {
        console.log("saving file");
        console.log(file);
        var data = new FormData();
        data.append('file', file);
        console.log(data);  // file is the user-selected file object
        var xhr = $.ajax({
            type: "POST",  
            url: "dishes/image",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function (res) {
                callback(res);
            },
            error: function (res) {
                console.log("erRRRRRRRRror");
            }
        });
        console.log("saved file");
    },

    isValidEmail: function(email) {
        // Retrieved from http://badsyntax.co/post/javascript-email-validation-rfc822
        return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
    },

    isWord: function(word) {
        // lower and capital letters, numbers, and underscore. 
        return /\w/.test(word);
    },

    isValidURL: function(url) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url) || !(url.trim());
    },

    // Check whether we are currently authenticated as a user. 
    // Execute the necessary actions to show that we are logged in or off.
    checkAuth: function(){
        console.log("Checking authentication")
        $.ajax({
            url: '/auth',
            type: 'GET',
            success: function(res){
                console.log("Auth check success.");
                console.log(res);
                if (res.userid){ // If authorized, execute actions to show logged in.
                    app.headerView.showAccount(res.username);
                } else {
                    app.headerView.showSignIn();
                }
            }, 
            error: function(err) {
                console.log("Auth check failed.");
                console.log(err);
                app.headerView.showSignIn();
            }
        });
    },

    showNotification: function(type, header, text){
        var alertElement = 
        "<div class='alert " + type + "'>" + 
            "<button type='button' class='close' data-dismiss='alert'>&times;</button>" +
            "<strong>" + header + "</strong>" + text +
        "</div>";
        $("#alerts").append(alertElement);
    },

    clearNotifications: function(){
        $("#alerts").empty();
    }
};
