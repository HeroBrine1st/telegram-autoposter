import config from '../config';

import getNewPost from './getNewPost';
import send from '../postSender';

(async function cacheLastPosts() {
  for (let id of config.get('groups')) {
    getNewPost(id);
  }
})();

setTimeout(async () => {
  for (let id of config.get('groups')) {
    getNewPost(id).then(post => {
      if (post) {
        send(post);
      }
    });
  }
}, 30 * 1000);