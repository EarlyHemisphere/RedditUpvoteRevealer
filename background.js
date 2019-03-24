var snoowrap = require('snoowrap');
var CONFIG = require('./config.json');
let previousUrl = "";

chrome.tabs.onUpdated.addListener(
  	function(tabId, changeInfo, tab) {
  		if (changeInfo.url && changeInfo.url != previousUrl && 
  			(changeInfo.url.includes("www.reddit") || changeInfo.url.includes("old.reddit"))) {
  			chrome.tabs.executeScript(null, {file: "bundle.js", runAt: "document_end"})
  			previousUrl = changeInfo.url;
  		}
  	}
);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var r = new snoowrap({
		  	userAgent: CONFIG.userAgent,
		  	clientId: CONFIG.clientId,
		  	clientSecret: CONFIG.clientSecret,
		  	refreshToken: CONFIG.refreshToken
		});

		if (!(request.msg)) {
			return;
		}

		if (request.msg === "getSubredditApiData") {
			getApiData(r, request.subreddit, request.sortMethod, request.sortTimeOption, sendResponse);
		} else if (request.msg === "getSubmission") {
			getSubmission(r, request.subredditAbbrev, sendResponse);
		}
		
		return true;
	});

function getApiData(r, subreddit, sortMethod, sortTimeOption, func) {
	switch (sortMethod) {
		case 'hot':
			r.getSubreddit(subreddit).getHot().then(func);
			break;
		case 'new':
			r.getSubreddit(subreddit).getNew().then(func);
			break;
		case 'rising':
			r.getSubreddit(subreddit).getRising().then(func);
			break;
		case 'top':
			r.getSubreddit(subreddit).getTop({time: sortTimeOption}).then(func);
			break;
		case 'controversial':
			r.getSubreddit(subreddit).getControversial({time: sortTimeOption}).then(func);
			break;
	}
}

function getSubmission(r, subredditAbbrev, func) {
	r.getSubreddit(subredditAbbrev).fetch().then(func);
}