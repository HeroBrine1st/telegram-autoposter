import config from '../config';

function hasBanWords(text: string): boolean {
  const banWords = config.get('banWords');
  const regexp = new RegExp(banWords.join('|'), 'iu');
  return regexp.test(text);
}

export default hasBanWords;