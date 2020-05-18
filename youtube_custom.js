// ==UserScript==
// @name             Censor YouTube recommendations
// @version          0.5.1
// @include          https://youtube.com/*
// @include          https://*.youtube.com/*
// ==/UserScript==


var hideRule = function(selector) {
    return selector + ' { display: none !important; }';
}

var censorRule = function(selector, color) {
    color = color || 'black';
    return (
        selector + ' { color: ' + color + ' !important; background-color: ' + color + ' !important; }\n'
        + selector + ':hover { color: ' + color + ' !important; }');
}


var RULES = [
    censorRule('#video-title', '#030303'),
    hideRule('ytd-thumbnail.ytd-compact-video-renderer'),
    hideRule('ytd-thumbnail.ytd-rich-grid-video-renderer')];

var URL_BLACKLIST = ['subscriptions', 'results', 'channel', 'user'];


var createStyle = function(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    return style;
}

function StyleHolder(cssRules) {
    this.elements = cssRules.map(createStyle);
}

StyleHolder.prototype.apply = function() {
    this.elements.map(document.head.appendChild.bind(document.head));
}

StyleHolder.prototype.revert = function() {
    this.elements.map(document.head.removeChild.bind(document.head));
}


function UrlWatcher(urlBlacklist, apply, revert, interval) {
    this.urlBlacklist = urlBlacklist;
    this.apply = apply;
    this.revert = revert;

    this.enabled = false;
    this.tick();
    this.interval = setInterval(this.tick.bind(this), interval || 300);
}

UrlWatcher.prototype.checkUrl = function(url) {
    for (var i = 0; i < this.urlBlacklist.length; i++) {
        if (url.search(this.urlBlacklist[i]) != -1) {
            return false;
        }
    }
    return true;
};

UrlWatcher.prototype.tick = function() {
    var enable = this.checkUrl(unsafeWindow.location.href);
    if (enable == this.enabled) {
        return;
    }
    this.enabled = enable;

    if (enable) {
        this.apply();
    } else {
        this.revert();
    }
};


var init = function() {
    var styleHolder = new StyleHolder(RULES);
    var urlWatcher = new UrlWatcher(
        URL_BLACKLIST,
        styleHolder.apply.bind(styleHolder),
        styleHolder.revert.bind(styleHolder));
}

init();
