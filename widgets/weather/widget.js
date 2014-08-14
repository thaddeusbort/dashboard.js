var dashboard_widget_weather_url = null;
var dashboard_widget_weather_default_location = "Auckland";

function weather_init(widget) {
    var url = "http://api.openweathermap.org/data/2.5/weather?units=imperial&";
    
    var location = widget.cfg().location;
    
    dashboard_widget_weather_url = url + "q=" +
        (!!location ? location
            : dashboard_widget_weather_default_location);

    if(!location) {
        // if no location was set, attempt to get location from browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                dashboard_widget_weather_url = url + "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
                widget.isReady(true);
            }, function() {
                console.log("Weather widget was unable to detect a location. Showing weather for " + dashboard_widget_weather_default_location + ".");
                widget.isReady(true);
            });
            return false;
        } else {
            console.log("Weather widget was unable to detect a location. Showing weather for " + dashboard_widget_weather_default_location + ".");
        }
    }

    return true;
}

function weather_getdata(cfg, callback) {
    // get weather data then use callback to send data

    var url = dashboard_widget_weather_url;
    if(!url) {
        console.log("Weather Widget: No location set.")
        return { };
    }
    
    $.getJSON(url, function(data) {
        var output = {
            name: data.name,
            temp: parseInt(data.main.temp),
            temp_max: parseInt(data.main.temp_max),
            temp_min: parseInt(data.main.temp_min),
            description: data.weather[0].description,
            last_updated: moment(new Date(data.dt*1000)).format("M/D h:mm a")
        };
        callback(output);
    });
    return { };
}