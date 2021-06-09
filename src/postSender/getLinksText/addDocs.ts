import prepareForHTML from '../prepareText/prepareForHTML';
import DocType from '../types/mediaTypes/DocType';

function addDocs(docs: DocType[], text: string, linksText: string): string {
  const nonIncludedDocs = docs.filter(doc => {
    return !text.includes(prepareForHTML(doc.url));
  });
  if (nonIncludedDocs.length > 0) {
    linksText += '\n';
    linksText += '\n<b>🗂 Документы:</b>';
    for (let doc of nonIncludedDocs) {
      linksText += `\n<a href="${doc.url}">${doc.title}</a>`;
    }
  }
  return linksText;
}

export default addDocs;