function google_calendar_init(widget) {
    widget.loadDependency("http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.7.0/moment.min.js");
    return false;
}

function google_calendar_getdata(cfg, callback) {
    // load calendar data then use callback to send data
    $.getJSON(cfg.url, function(data) {
        var output = {
            title: data.feed.title.$t,
            events: []
        };
        
        output.lastUpdated = moment(new Date(data.feed.updated.$t)).format("M/D h:mm a");
        var itemCount = !!cfg.itemcount ? cfg.itemcount : 3;

        // only get future items, order by date ascending, and limit to itemCount
        var today = new Date(); today.setHours(0,0,0);

        output.events = _.first(
            _.sortBy(
                _.reduce(data.feed.entry, function(memo, entry) {
                    if(!!entry.gd$when && entry.gd$when.length > 0) {
                        var start = new Date(entry.gd$when[0].startTime + " 00:00");
                        var end = new Date(entry.gd$when[0].endTime + " 00:00");
                        if(today <= end) {
                            memo.push({
                                startDate: start,
                                date: moment(start).format("M/D") + (start == end ? "" : "-" + moment(end).format("M/D")),
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