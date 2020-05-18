// ==UserScript==
// @name             Custom Youtube rules
// @version          0.5.0
// @include          https://youtube.com/*
// @include          https://*.youtube.com/*
// ==/UserScript==


function StyleHolder() {
    this.blacklist = arguments;
    this.elements = [];
    this.interval = setInterval(this.tick.bind(this), 300);
    this.enabled = false;
}

StyleHolder.prototype.checkUrl = function(url) {
    for (var i = 0; i < this.blacklist.length; i++) {
        if (url.search(this.blacklist[i]) != -1) {
            return false;
        }
    }
    return true;
}

StyleHolder.prototype.tick = function() {
    var enable = this.checkUrl(unsafeWindow.location.href);
    if (enable == this.enabled) {
        return;
    }
    this.enabled = enable;
    var action = (enable ? document.head.appendChild : document.head.removeChild).bind(document.head);
    this.elements.map(action);
}

StyleHolder.prototype.addStyle = function(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    this.elements.push(style);
}

StyleHolder.prototype.hide = function(selector) {
    this.addStyle(selector + ' { display: none !important; }');
}

StyleHolder.prototype.blacken = function(selector, color) {
    color = color || 'black';
    this.addStyle(
        selector + ' { color: ' + color + ' !important; background-color: ' + color + ' !important; }\n'
        + selector + ':hover { color: ' + color + ' !important; }');
}


var styleHolder = new StyleHolder('subscriptions', 'results', 'channel', 'user');
styleHolder.blacken('#video-title', '#030303');
styleHolder.hide('ytd-thumbnail.ytd-compact-video-renderer');
styleHolder.hide('ytd-thumbnail.ytd-rich-grid-video-renderer');
