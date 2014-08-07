var dashboardjs_widget_leaflet_map = null;
var dashboardjs_widget_leaflet_data_layer = null;

function leaflet_init(widget) {
    widget.loadStyle("http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css");
    widget.loadScript("http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js");
    return false;
}

function leaflet_getdata(cfg, callback) {
    // load geojson data then add to map
    $.getJSON(cfg.jsonurl, function(data) {
        
        // only add map once
        if(!dashboardjs_widget_leaflet_map) {
            dashboardjs_widget_leaflet_map = L.map("map").setView([39, -84], 13);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(dashboardjs_widget_leaflet_map);
        }

        //console.log(data);
        if(!!dashboardjs_widget_leaflet_data_layer)
            dashboardjs_widget_leaflet_map.removeLayer(dashboardjs_widget_leaflet_data_layer);

        var popup;
        dashboardjs_widget_leaflet_data_layer = L.geoJson(data, {
            onEachFeature: function(feature, layer) {
                var title = feature.properties && feature.properties.title;
                console.log(title);
                if(!!title)
                    popup = layer.bindPopup(title);
            },
            filter: function(feature, layer) {
                // only show active
                return !(feature.properties && feature.properties.active === "false");
            }
        }).addTo(dashboardjs_widget_leaflet_map);

        popup.openPopup();
        if(dashboardjs_widget_leaflet_data_layer.toGeoJSON().features.length > 0)
            dashboardjs_widget_leaflet_map.fitBounds(dashboardjs_widget_leaflet_data_layer);
        

        // don't call the callback method because we don't want the html to be overwritten
    });
    return { };
}