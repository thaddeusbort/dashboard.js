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
            bgcolor: '',
            ready: false,
            data: {}
        },
        init: function(attributes, options) {
            var cfg = this.cfg();
            this.set("id", cfg.id);
            this.set("type", cfg.type);
            var fnname = cfg.type + "_init";

            // if an init function exists for this widget, run it
            if(typeof window[fnname] == "function") {
                var ready = window[fnname](this);
                this.isReady(!!ready);
            } else {
                this.isReady(true);
            }
        },
        loadScript: function(url) {
            this.isReady(false);
            var $this = this;
            $.getScript(url, function(script, textStatus, jqxhr) {
                $this.isReady(true);
            })
            .fail(function(jqxhr, settings, exception) {
                console.log("failed getting dependency for widget " + this.id);
                console.log(exception);
            });
        },
        loadStyle: function(url) {
            $("<link>")
                .appendTo("head")
                .attr({type: "text/css", rel: "stylesheet", href: url});
        },
        isReady: function(val) {
            if(val == undefined)
                return this.get("ready");
            else {
                this.set("ready", val);
            }
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
            var frequencyStr = this.cfg().frequency;
            var frequency = 0;
            if(!!frequencyStr) {
                var match = frequencyStr.toString().match(/(\d+)([s|m|h|d])?/i);
                if(!!match) {
                    var val = parseInt(match[1]);
                    switch(match[2]) {
                        case "s":
                            frequency = val*1000;
                            break;
                        case "h":
                            frequency = val*3600000;
                            break;
                        case "d":
                            frequency = val*86400000;
                            break;
                        case "m":
                        default:
                            frequency = val*60000;
                    }
                }
            }
            // don't allow the freuency to be set faster than 5 seconds
            if(frequency > 0 & frequency < 5000)
                frequency = 5000;
            return frequency;
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

            this.$defaultColors = [ "#8C3565", "#45B9B1", "#FF9625", "#0BADC0", "#01B05D", "#E8623B", "#FFC32F" ];
            this.$widgets = this.$("widget");

            this.$grid = this.$(".gridster ul");
            this.$gridster = this.$grid.gridster({
                widget_base_dimensions: [300, 360],
                max_cols: 4
            }).data("gridster");

            app.widgets.on("change:ready", this.updateWidget, this);

            var $this = this;
            _.each(this.$widgets, function(child, index, list) {
                var config = $(child).data();
                var type = config.type;
                var src = "widgets/" + type + "/widget.js";
                var templateUrl = "widgets/" + type + "/widget.html";

                var widget = new app.Widget({
                    cfg: config,
                    bgcolor: $this.$defaultColors[index%$this.$defaultColors.length]
                });

                $.getScript(src, function(script, textStatus, jqxhr) {
                    $.get(templateUrl, function(template) {
                        widget.set("template", _.template(template));
                        widget.init();

                        app.widgets.push(widget);

                        if(widget.isReady())
                            $this.updateWidget(widget);
                    });
                })
                .fail(function(jqxhr, settings, exception) {
                    console.log("failed getting script for " + type + " widget " + config.id);
                    console.log(exception);
                });

                $this.addWidget(widget);
            });
        },

        addWidget: function(widget) {
            var view = new app.WidgetView({ model: widget });

            var size_x = widget.cfg().width;
            var size_y = widget.cfg().height;
            this.$gridster.add_widget(view.el, size_x, size_y);
        },

        updateWidget: function(widget, value, options) {
            if(!widget.isReady())
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
            //console.log("Rendering widget: " + this.model.id);
            var template = this.model.get("template");
            if(!template)
                return this;
            var output = template({ model: this.model.getData() });
            output = $(output);

            var cfg = this.model.cfg();
            output.addClass("widget widget-" +cfg.type);

            var bg = !!cfg.bgcolor ? cfg.bgcolor : this.model.get("bgcolor");
            output.css("background-color", bg);

            this.$el.html(output);

            return this;
        }

    });

    new app.AppView({
        // define the element where the view will render
        el: $("#app-container")
    });
            
})(jQuery);