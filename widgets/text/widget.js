function text_getdata(cfg) {
    return {
        title: !!cfg.title ? cfg.title : "No title was specified",
        text: !!cfg.text ? cfg.text : "No text was specified",
    };
}