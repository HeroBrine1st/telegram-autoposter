import config from '../config';

import getNewPost from './getNewPost';
import send from '../postSender';

(async function cacheLastPosts() {
  for (const id of config.get('groups')) {
    getNewPost(id);
  }
})();

setInterval(async () => {
  for (const id of config.get('groups')) {
    getNewPost(id).then(post => {
      if (post) {
        send(post);
      }
    });
  }
}, 30 * 1000);