const charMap = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;'
};

function prepareForHTML(text: string): string {
  let preparedText = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] in charMap) {
      preparedText += charMap[text[i]];
    } else {
      preparedText += text[i];
    }
  }
  return preparedText;
}

export default prepareForHTML;