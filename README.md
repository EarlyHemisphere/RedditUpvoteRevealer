Note: this repo was copied over from another because of an accidental push of sensitive info

# RedditUpvoteRevealer
A chrome extension that reveals the number of upvotes on Reddit posts with their upvote counts hidden by default.

This was made using node.js and browserify, and uses snoowrap (A JavaScript wrapper for the Reddit API).

It is functional, but only partially. See the "Notes" section.

## Setup

This extension is not published, and must be manually added by enabling developer mode in chrome://extensions, choosing "Load Unpacked", and selecting the root folder.

The Reddit API needs a `userAgent`, `clientId`, `clientSecret`, and `refreshToken` to be accessed. These are obtained through an app on your Reddit account. Details for how to obtain the first three can be found [here](https://github.com/reddit-archive/reddit/wiki/OAuth2-Quick-Start-Example), and the refresh token can be obtained by running the script [here](https://praw.readthedocs.io/en/latest/tutorials/refresh_token.html). Once these are obtained and Config.json is updated, the extension will work properly.

## Notes

The script is incomplete - refer to the TODO list below for features that still need to be implemented. Some of the items are easy to fix, but I just haven't gotten around to fixing them yet.

### TODO:

- Change all posts, and not just the first ~10
- Respond to scrolling/lazy-loading
- Update when ~~sorting method~~ or subreddit is updated within Reddit, and not just on direct load
- Work on old.reddit.com
- Work when posts are viewed on redesign
- Work when posts are viewed on old design
- Respond to post view format change on redesign
- Add listener to increment/decrement revealed upvote score on upvote/downvote
