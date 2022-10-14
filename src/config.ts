import Conf from 'conf';

const config = new Conf({
  defaults: {
    tokens: {
      vk: "",
      telegram: "",
      telegraph: "",
    },
    channel: 0,
    groups: [],
    banWords: [],
    "youtube-dl-binary": "youtube-dl",
    adminChatId: 0, // 0 to disable
    useTelegraph: true, // false to split long posts to smaller chunks and send as multiple messages
  },
  configName: 'config',
  cwd: './',
});

export default config;