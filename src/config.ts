import Conf from 'conf';

const config = new Conf({
  defaults: {
    tokens: {
      vk: "",
      telegram: "",
    },
    channel: 0,
    groups: [],
    banWords: [],
    "youtube-dl-binary": "youtube-dl"
  },
  configName: 'config',
  cwd: './'
});

export default config;