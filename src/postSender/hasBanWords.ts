import config from '../config';

function hasBanWords(text: string): boolean {
  const banWords = config.get('banWords');
  if (banWords.length > 0) {
    const regexp = new RegExp(banWords.join('|'), 'iu');
    return regexp.test(text);
  }
  return false;
}

export default hasBanWords;