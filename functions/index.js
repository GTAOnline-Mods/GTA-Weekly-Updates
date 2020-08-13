const functions = require("firebase-functions");
const reddit = require("./reddit");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.getSubredditIcon = functions.https.onCall((data, context) => {
  return Promise.all(reddit.subreddit.community_icon, reddit.subreddit.icon_img)
    .then((community_icon, icon_img) => ({
      community_icon: community_icon,
      icon_img: icon_img,
    }))
    .catch((error) => ({ error }));
});
