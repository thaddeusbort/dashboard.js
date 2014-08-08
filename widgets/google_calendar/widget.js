function google_calendar_getdata(cfg, callback) {
    // load calendar data then use callback to send data
    $.getJSON(cfg.url, function(data) {
        var output = {
            title: data.feed.title.$t,
            events: []
        };
        
        output.last_updated = moment(new Date(data.feed.updated.$t)).format("M/D h:mm a");
        var itemCount = !!cfg.itemcount ? cfg.itemcount : 3;

        // only get future items, order by date ascending, and limit to itemCount
        var today = new Date(); today.setHours(0,0,0);

        output.events = _.first(
            _.sortBy(
                _.reduce(data.feed.entry, function(memo, entry) {
                    if(!!entry.gd$when && entry.gd$when.length > 0) {
                        var start = google_calendar_parse_date(entry.gd$when[0].startTime);
                        var end = google_calendar_parse_date(entry.gd$when[0].endTime);
                        if(end > start)
                            end.setDate(end.getDate()-1);
                        if(today <= end) {
                            memo.push({
                                startDate: start,
                                date: moment(start).format("M/D") + (start.getTime() == end.getTime() ? "" : "-" + moment(end).format("M/D")),
                                title: entry.title.$t
                            });
                        }
                    }
                    return memo;
                }, [])
            , function(val) { return val.startDate.getTime(); })
        , itemCount);

        callback(output);
    });
    return { };
}

function google_calendar_parse_date(datestring) {
    var parts = datestring.split("-");
    return new Date(parts[0], parts[1]-1, parts[2]);
}