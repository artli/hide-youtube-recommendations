// ==UserScript==
// @id               hide-youtube-recommendations@artli
// @name             Hide YouTube recommendations
// @version          0.5.3
// @author           https://github.com/artli
// @license          Mozilla Public License 2.0
// @namespace        https://github.com/artli/hide-youtube-recommendations
// @description      Remove thumbnails and censor video titles of the recommended videos on the main page and in the recommendation sidebar.

// @downloadURL      https://raw.githubusercontent.com/artli/hide-youtube-recommendations/latestRelease/hide_youtube_recommendations.user.js
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
    censorRule('#video-title:not(.ytd-playlist-panel-video-renderer)', '#030303'),
    hideRule('ytd-thumbnail:not(.ytd-playlist-panel-video-renderer)')];

var URL_BLACKLIST = ['subscriptions', 'library', 'history', 'my_videos', 'playlist', 'results', 'channel', 'c', 'user'];


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
