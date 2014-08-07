dashboard.js google calendar widget
============

A widget to display a google calendar feed.

## Syntax
    <widget data-id="google_calendar_widget_id" data-type="google_calendar" data-frequency="1h" data-itemcount="5"
                    data-url="http://www.google.com/calendar/feeds/ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com/public/full?alt=json"></widget>

## Type
`google_calendar`

## Properties

 - `data-itemcount` the maximum number of items to display
 - `data-url` the url of the calendar feed, the feed must either be public or the shareable private url and you must append ?alt=json
 - `data-frequency` how often to update (see main README for more info)
