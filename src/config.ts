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
    adminChatId: 0, // TODO draft; Check if it can accept group IDs as well as user IDs
  },
  configName: 'config',
  cwd: './'
});

export default config;