// ==UserScript==
// @name           Custom Youtube rules
// @version        0.2.0
// @include          https://youtube.com/*
// @include          https://*.youtube.com/*
// @exclude          https://*.youtube.com/feed/subscriptions
// ==/UserScript==


function addStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
}

function hide(selector) {
    addStyle(selector + ' { display: none !important; }');
}

function blacken(selector, color) {
    color = color || 'black';
    addStyle(selector + ' { color: ' + color + ' !important; background-color: ' + color + ' !important; }\n' + selector + ':hover { color: ' + color + ' !important; }');
}

old_onload = document.body.onload;
document.body.onload = function(e) {
    blacken('.content-link .title', '#333');
    blacken('.yt-lockup-title .yt-ui-ellipsis', '#333');
    hide('.yt-uix-simple-thumb-wrap');
    hide('.video-thumb');
    old_onload(e);
};
