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