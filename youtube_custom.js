// ==UserScript==
// @name           Custom Youtube rules
// @version        0.1.0
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

document.body.onload = function() {
    hide('.related-list-item, .video-list-item, .yt-shelf-grid-item, .feed-item-container');
    //hide('.yt-shelf-grid-item');
    //hide('.feed-item-container');
};
