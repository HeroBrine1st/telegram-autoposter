import pipe from '../../utils/pipe';

import formatVKLinks from './formatVKLinks';
import prepareForHTML from './prepareForHTML';

function prepareText(text: string): string {
  return pipe(
    prepareForHTML,
    formatVKLinks
  )(text);
}

export default prepareText;