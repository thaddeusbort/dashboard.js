function random_number_getdata(cfg) {
    return {
        val: Math.floor((Math.random() * cfg.max) + cfg.min)
    };
}