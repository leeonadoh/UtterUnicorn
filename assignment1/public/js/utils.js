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
    }
};
