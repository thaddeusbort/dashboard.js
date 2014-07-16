dashboard.js
============

An easy and intuitive dashboard framework built on backbone.


# Introduction
Dashboard.js is a backbone based framework for building dashboard for displaying your important data.

#### Features:

 - No custom server required. All code is run on the frontend making it easy to test and quick to deploy.
 - Use some of our example widgets or easily build your own with html and javascript.
 - Drag & drop interface for re-arranging your widgets. [Powered by Gridster.js](https://github.com/ducksboard/gridster.js)


# Getting started
Download this project. To configure which widgets to display and their settings edit the `<widgets>` section of index.html.

### Widget Configuration
...coming soon...

### Widget Creation
To create a new widget type, create a folder in the widgets directory. The name of the folder will be the type name. Add a `widget.html` file that will be the html template and a `widget.js` file that will hold any logic for the widget. The `widget.js` file should contain a function name `WIDGET_TYPE_getdata`. Dashboard.js will call this function when the dashboard is first loaded as well as on an interval if a `data-frequency` attribute is set on the widget. The function is passed a reference to the configuration which includes all data- parameters from the widget tag as well as a callback function that can be used to pass data back from a long running operation. See the `google_calendar` example widget for an example of this.

You can also specify a `WIDGET_TYPE_init` function that will get called when the widget is first loaded. This can be helpful for loading dependencies like external javascript libraries. See the `google_calendar` example widget for an example of this.

# License
Distributed under the MIT license.
