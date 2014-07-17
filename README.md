dashboard.js
============

An easy and intuitive dashboard framework built on backbone and inspired by [Dashing](http://dashing.io).

Check out the demo:
http://rawgit.com/thaddeusbort/dashboard.js/master/index.html


# Introduction
Dashboard.js is a backbone based framework for building dashboard for displaying your important data.

#### Features:

 - No custom server required. All code is run on the frontend making it easy to test and quick to deploy.
 - Use some of our example widgets or easily build your own with html and javascript.
 - Drag & drop interface for re-arranging your widgets. [Powered by Gridster.js](https://github.com/ducksboard/gridster.js)


# Getting started
Download this project. To configure which widgets to display and their settings edit the `<widgets>` section of index.html.

### Widget Configuration
Widgets can have any number of configuration properties that are setting using `data-` attributes on the widget tag. 

This example shows how the attributes `title` and `text` are set for the text widget:

```html
<widget data-id="text_widget_id" data-type="text" data-title="HELLO!" data-text="I'm a text widget"></widget>
```

The widget README should specify which attributes are available.

#### Frequency Attribute
A common attribute used by any widget that needs to be updated on a regular interval is the `frequency` attribute. The frequency attribute can be set in seconds, minutes, hours, or days by using the first letter of the unit type after the number.

```javascript
data-frequency="10s"   // 10 seconds
data-frequency="10m"   // 10 minutes
data-frequency="10h"   // 10 hours
data-frequency="10d"   // 10 days
data-frequency="100"   // 100 minutes
```
> If no unit type is specified, minutes will be used by default.

This example shows a weather widget that will be updated every 20 minutes:

```html
<widget data-id="weather_widget_id" data-type="weather" data-frequency="20m"></widget>
```

> Any frequency faster than 5 seconds will be set to 5 seconds.

### Widget Creation
To create a new widget type, create a folder in the widgets directory. The name of the folder will be the type name. Add a `widget.html` file that will be the html template and a `widget.js` file that will hold any logic for the widget. The `widget.js` file should contain a function name `WIDGET_TYPE_getdata`. Dashboard.js will call this function when the dashboard is first loaded as well as on an interval if a `data-frequency` attribute is set on the widget. The function is passed a reference to the configuration which includes all data- parameters from the widget tag as well as a callback function that can be used to pass data back from a long running operation. See the `google_calendar` example widget for an example of this.

You can also specify a `WIDGET_TYPE_init` function that will get called when the widget is first loaded. This can be helpful for loading dependencies like external javascript libraries. See the `google_calendar` example widget for an example of this.

# License
Distributed under the MIT license.
