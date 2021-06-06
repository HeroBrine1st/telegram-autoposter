import vk from '../vk';
import config from '../config';
import logger from '../logger';

(async () => {
  if (!config.get('tokens.vk')) {
    logger.error('VK token is not specified.');
    process.kill(process.pid, 'SIGINT');
  }

  const groupsIds = config.get('groups').map(group => {
    if (typeof group === 'string') {
      const result = group.match(/(?:club|public)(\d+)/);
      if (result && result[1]) {
        return result[1];
      } else {
        return group;
      }
    } else {
      return Math.abs(group);
    }
  });

  try {
    const groups = await vk.groups.getById({
      'group_ids': groupsIds.join(',')
    });
    if (groupsIds.length !== groups.length) {
      logger.warn('Incorrect groups are specified.');
    }
    config.set('groups', groups.map(group => -group.id));
  } catch (e) {
    logger.warn('VK token is incorrect.');
    process.kill(process.pid, 'SIGINT');
  }

})();