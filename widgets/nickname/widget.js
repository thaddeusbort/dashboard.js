var dashboardjs_widget_nickname_names = [];
var dashboardjs_widget_nickname_used = [];
function nickname_init(widget) {
    dashboardjs_widget_nickname_names = ["Die Harder", "Felicia Fancybottom", "Ground Control", "Matt", "Bighead Burton", "Fingers", "Homeskillet", "Big Baby Burton", "Burton the Billowy Bear", "Curtis", "Blackstar", "Chocolate Columbo", "Magic Head", "Spellmaster", "SuperSmeller or The SuperSniffer", "Slicks", "Peter Panic", "Gus T.T. Showbiz", "Ovaltine Jenkins", "Schoonie \"U-Turn\" Singleton", "Vernest Lambert Watkins", "Bud", "Nick Nack", "Bruton Gaster", "Lavender Gooms", "Lemongrass Gogulope", "Squirts MacIntosh", "Weepy Boy Santos", "Stewart Lee", "François", "Galileo Humpkins", "Gus \"Silly-Pants\" Jackson", "Fearless Guster", "Shmuel Cohen", "Methuselah Honeysuckle", "Shutterfly Simmons", "Paddy Simcox", "Chesterfield McMillan (and wife)", "Tan", "Tangus", "Ernesto Agapito Garces Conde de Abelar", "Longbranch Pennywhistle", "Scrooge Jones", "D'Andre Pride", "Hummingbird Saltalamacchia", "Step-Anthony Wally Ali", "Art Vandelay", "Dequan \"Smallpox\" Randolph", "Trapezius Milkington", "Sterling Cooper", "Burton \"Oil Can\" Guster", "Hollabackatcha", "Jazz Hands", "Gus Brown", "John Slade", "Detective Miles", "Greg", "Doughnut Johnathan Jacob Jinggly Smith", "Holschtein", "Ron Davis", "Bob Adams", "Harry Munroe", "Rich Fingerland", "Black Magic", "Cheswick", "Shawn", "Shaggy Buddy Snap", "Ghee Buttersnaps a.k.a. \"The Heater\"", "The Vault of Secrets", "Clementine Woolysocks", "Pinky Guscatero", "Guts", "Ol' Ironside", "Old Iron Stomach", "Bruce Lee", "Jonathan Jacob Jingley-Smith", "Santonio Holmes", "Deon Richmond", "Gurton Buster", "Chaz Bono", "Chocolate Einstein", "MC ClapYoHandz", "Mrs. Whittlebury", "G-Force", "Roadrash", "Mellowrush", "Crankshaft", "Sammy", "Joey Bishop", "Slick Fingers", "Imhotep", "Control Alt Delete", "Gootsy", "The Guster", "The Jackal", "Adewale Akinnuoye-Agbaje", "Yasmine Bleeth", "Killerbee", "Lodge Blackman", "Mission Figs", "Sundown", "The Black Goose", "Radio Star", "Gus Jay Gupta", "Don Cheadle Jr.", "Chezwick", "Watson Williams", "Benedict Arnold Jackson", "Engel Woods", "Eddie Adams from Torrance", "Brutal Hustler", "Lumpkin...", "Felatio Del Toro", "Tin Tummy", "Sh'Dynasty", "Carrington", "Satchel Gizmo", "Gurn Blandstein", "Bill Uvrights", "Jonas Gustavsson", "Blue Ivy Carter", "Darrell", "Burton Trout", "Bad News Marvin Barnes", "Trending Ontwitter"];
    return true;
}

function nickname_getdata(cfg, callback) {
    // show a random nickname from the list

    // if all the names have been used, start over
    if(dashboardjs_widget_nickname_used.length >= dashboardjs_widget_nickname_names.length)
        dashboardjs_widget_nickname_used = [];

    var unused_list = _.without(dashboardjs_widget_nickname_names, dashboardjs_widget_nickname_used);
    var nickname = _.sample(unused_list);

    dashboardjs_widget_nickname_used.push(nickname);

    return { nickname: nickname };
}