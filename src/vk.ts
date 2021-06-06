import { API } from 'vk-io';
import config from './config';

const vk = new API({ token: config.get('tokens.vk'), apiMode: 'parallel' });

export default vk;