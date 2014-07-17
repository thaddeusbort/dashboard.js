var dashboard_widget_weather_url = null;
var dashboard_widget_weather_location = { query:"", lat:null, lon:null };
var dashboard_widget_weather_default_location = "Auckland";

function weather_init(widget) {
    var url = "http://api.openweathermap.org/data/2.5/weather?units=imperial&";
    
    var location = widget.cfg().location;
    if(!!location) {
        dashboard_widget_weather_location.query = location;
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                dashboard_widget_weather_location.lat = position.coords.latitude;
                dashboard_widget_weather_location.lon = position.coords.longitude;
                dashboard_widget_weather_url = url + "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
                widget.isReady(true);
            });
            return false;
        } else {
            dashboard_widget_weather_location.query = dashboard_widget_weather_default_location;
            console.log("Weather widget was unable to detect a location. Showing weather for " + dashboard_widget_weather_default_location + ".");
        }
    }

    if(!!dashboard_widget_weather_location.query)
        dashboard_widget_weather_url = url + "q=" + dashboard_widget_weather_location.query;
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