function* textGhunkGenerator(
  text: string,
  linksText: string,
  photoPost: boolean = false
) {
  const TEXT_POST_LIMIT = 4096;
  const PHOTO_POST_LIMIT = 1024;
  const FIRST_POST_LIMIT = photoPost ? PHOTO_POST_LIMIT : TEXT_POST_LIMIT;
  const WORD_LIMIT = 256;

  let beginIndex = 0;
  let endIndex = 0;

  while (true) {
    let postLimit = beginIndex === 0 ? FIRST_POST_LIMIT : TEXT_POST_LIMIT;
    let possibleEndIndex = beginIndex + postLimit;
    if (possibleEndIndex < text.length) {
      possibleEndIndex -= beginIndex === 0 ? 6 : 12;
      
      let breakIndex;

      for (let i = possibleEndIndex; i >= possibleEndIndex - WORD_LIMIT; i--) {
        if (text[i] === ' ' && !breakIndex) {
          breakIndex = i;
          continue;
        }

        if (text[i] === '<') {
          if (text.slice(i, i + 4) === '</a>') {
            if (breakIndex && breakIndex > i) {
              break;
            }
          }

          if (text.slice(i, i + 8) === '<a href=') {
            if (breakIndex && breakIndex > i) {
              breakIndex = undefined;
              continue;
            }
          }
        }
      }

      endIndex = breakIndex;

      let textPart = '';
      if (beginIndex !== 0) {
        textPart += '(...) ';
      }
      textPart += text.slice(beginIndex, endIndex);
      textPart += ' (...)';

      beginIndex = endIndex + 1;

      yield textPart;
    } else {
      let textPart = '';
      if (beginIndex !== 0) {
        textPart += '(...) ';
      }
      textPart += text.slice(beginIndex);

      if (textPart.length + linksText.length <= postLimit) {
        yield textPart + linksText;
      } else {
        yield textPart;
        yield linksText;
      }
      break;
    }
  }
}

export default textGhunkGenerator;