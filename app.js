(function($) {
    'use strict';

    // Define the model
    var app = app || {};
    app.Widget = Backbone.Model.extend({
        defaults: {
            // set default values here
            id: '',
            type: '',
            cfg: '',
            template: '',
            ready: false,
            data: {}
        },
        initialize: function(attributes, options) {
            var cfg = this.cfg();
            this.set("id", cfg.id);
            this.set("type", cfg.type);
            var fnname = cfg.type + "_init";

            // if an init function exists for this widget, run it
            if(typeof window[fnname] == "function") {
                var ready = window[fnname](this);
                this.set("ready", !!ready);
            } else {
                this.set("ready", true);
            }
        },
        loadDependency: function(url) {
            this.set("ready", false);
            var $this = this;
            $.getScript(url, function(script, textStatus, jqxhr) {
                $this.set("ready", true);
            })
            .fail(function(jqxhr, settings, exception) {
                console.log("failed getting dependency for widget " + this.get("id"));
                console.log(exception);
            });
        },
        isLoaded: function() {
            return this.get("ready");
        },
        cfg: function() {
            return this.get("cfg");
        },
        getData: function() {
            return this.get("data");
        },
        updateData: function() {
            var cfg = this.cfg();
            var fnname = cfg.type + "_getdata";
            
            // the widget getdata function can either return data or use the callback function to return data asynchronously
            //  if using the callback, the function can return a loading message while it's working
            var $this = this;
            var d = window[fnname](cfg, function(d) {
                $this.set("data", d);
            });
            if(!!d)
                this.set("data", d);
        },
        getFrequency: function() {
            var frequency = this.cfg().frequency;
            return !!frequency ? frequency*1000 : 0;
        }
    });

    var Widgets = Backbone.Collection.extend({
        model: app.Widget,
    });

    app.widgets = new Widgets();

    // Define the Main View
    app.AppView = Backbone.View.extend({
        events: {
        },

        initialize: function() {

            this.$widgets = this.$("widget");

            this.$grid = this.$(".gridster ul");
            this.$gridster = this.$grid.gridster({
                widget_base_dimensions: [300, 360]
            }).data("gridster");

            this.listenTo(app.widgets, 'add', this.addWidget);
            app.widgets.on("change:ready", this.updateWidget, this);

            _.each(this.$widgets, function(child, index, list) {
                var config = $(child).data();
                var type = config.type;
                var src = "widgets/" + type + "/widget.js";
                var template = "widgets/" + type + "/widget.html";

                $.getScript(src, function(script, textStatus, jqxhr) {
                    $.get(template, function(template) {
                        var widget = new app.Widget({
                            cfg: config,
                            template: _.template(template)
                        });
                        app.widgets.push(widget);
                    });
                })
                .fail(function(jqxhr, settings, exception) {
                    console.log("failed getting script");
                    console.log(exception);
                });
            });
        },

        addWidget: function(widget) {
            var view = new app.WidgetView({ model: widget });
            this.$gridster.add_widget(view.el);

            //console.log("widget " + widget.id + " ready: " + widget.isLoaded());
            if(widget.isLoaded())
                this.updateWidget(widget);
        },

        updateWidget: function(widget, value, options) {
            if(!widget.isLoaded())
                return;

            var frequency = widget.getFrequency();
            //console.log("updating widget: " + widget.id);
            widget.updateData();
            
            var $this = this;
            if(frequency > 0) {
                setTimeout(function() {
                    $this.updateWidget(widget);
                }, frequency);
            }
        }
    });

    // Define the Widget View
    app.WidgetView = Backbone.View.extend({
        tagName: 'li',
        initialize: function() {
            this.$el.attr("id", this.model.id);
            this.render();
            
            this.model.on("change", this.render, this);
        },
        render: function() {
            //console.log("Rendering widget: " + this.model.get("id"));
            var template = this.model.get("template");
            this.$el.html(template({ model: this.model.getData() }));

            return this;
        }

    });

    new app.AppView({
        // define the element where the view will render
        el: $("#app-container")
    });
            
})(jQuery);