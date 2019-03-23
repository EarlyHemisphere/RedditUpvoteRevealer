var snoowrap = require('snoowrap');
var CONFIG = require('./config.json');
var hiddenUpvoteElements;

var r = new snoowrap({
  	userAgent: CONFIG.userAgent,
  	clientId: CONFIG.clientId,
  	clientSecret: CONFIG.clientSecret,
  	refreshToken: CONFIG.refreshToken
});

const url = document.getElementsByTagName("body")[0].baseURI;
const subPos = url.indexOf('/r/') + 3;
const subPos_end = url.indexOf('/', subPos);
const subreddit = url.substring(subPos, subPos_end);

determineRedditPage();

function determineRedditPage() {
	urlStart = url.indexOf("://") + 3;
	if (url.substring(urlStart, urlStart + 3) === "old") {
		runOnOldDesign();
	} else {
		runOnRedesign();
	}
}

function runOnRedesign() {
	commentsIndex = url.indexOf("comments/")
	if (commentsIndex === -1) {
		var width100Elements = document.querySelectorAll("[style='max-width:100%']");
		var postsElement = width100Elements[width100Elements.length - 1].firstChild;
		var sortPos_end = url.indexOf('/', subPos_end + 1);
		var sortMethod = url.substring(subPos_end + 1, sortPos_end);
		var timeOption = url.indexOf('?t=') + 3;
		var sortTimeOption = url.substring(timeOption, url.length);
		waitForPosts(postsElement, sortMethod, sortTimeOption);
	} else {
		var commentsIndex_end = commentsIndex + 9
		var nextSlashIndex = url.indexOf('/', commentsIndex_end);
		var submissionAbbrev = url.substring(commentsIndex_end, nextSlashIndex);
		r.getSubmission(submissionAbbrev).fetch().then(revealSubmissionUpvotes);
	}
}

async function waitForPosts(postsElement, sortMethod, sortTimeOption) {
	while (postsElement.childNodes.length < 2) {
		await new Promise(t => setTimeout(t, 500));
	}
	getSubredditApiData(revealSubredditUpvotes, sortMethod, sortTimeOption);
}

function runOnOldDesign() {
	console.log("old design");
}

function getSubredditApiData(func, sortMethod, sortTimeOption) {
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

function revealSubmissionUpvotes(submission) {
	postElement = document.querySelector('div[data-test-id="post-content"]');
	upvoteElement = postElement.querySelector('div[style="color: rgb(26, 26, 27);"]');
	upvoteText = upvoteElement.innerText;
	if (isNaN(upvoteText) && upvoteText.indexOf("k") === -1) {
		title = postElement.querySelector('h2').innerText;
		upvoteElement.innerText = submission.ups;
		document.querySelector('[style="color: rgb(215, 218, 220);"]').innerText = submission.ups;
	}
}

function revealSubredditUpvotes(apiData) {
	var hiddenUpvoteElements = document.querySelectorAll("div[style='color:#1A1A1B'],div[style='color: rgb(26, 26, 27);']");
	var numSubmissions = apiData.length < hiddenUpvoteElements.length ? apiData.length : hiddenUpvoteElements.length;
	for(var i = 0; i < numSubmissions; i++) {
		upvoteText = hiddenUpvoteElements[i].innerText;
		if (isNaN(upvoteText) && upvoteText.indexOf("k") === -1) {
			scrollItem = hiddenUpvoteElements[i].parentElement.parentElement.parentElement;
			title = scrollItem.querySelector("h2").innerText;
			hiddenUpvoteElements[i].innerText = getApiResult(title, apiData).ups;
		}
	}
}

function getApiResult(name, apiData) {
	return apiData.find(function(element) {
		return element.title === name;
	});
}