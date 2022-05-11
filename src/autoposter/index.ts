import config from '../config';

import getNewPost from './getNewPost';
import send from '../postSender';

(async function cacheLastPosts() {
  for (const id of config.get('groups')) {
    await getNewPost(id);
  }
  console.log("Completed caching last posts")
})();

setInterval(async () => {
  console.log("Tick")
  for (const id of config.get('groups')) {
    getNewPost(id).then(post => {
      if (post) {
        return send(post);
      }
    }).catch(console.error);
  }
}, 30 * 1000);
