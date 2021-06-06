import config from '../config';

import getNewPost from './getNewPost';
import send from '../postSender';

const groups = config.get('groups');

const delay = ms => new Promise(res => setTimeout(() => res(true), ms));

setTimeout(async () => {
  for (let id of groups) {
    const post = await getNewPost(id);
    if (post) {
      send(post);
    }
    await delay(1000);
  }
}, 30 * 1000);