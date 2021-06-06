import LinkType from '../types/mediaTypes/LinkType';

function addLinks(links: LinkType[], text: string, linksText: string): string {
  const nonIncludedLinks = links.filter(link => !text.includes(link));
  if (nonIncludedLinks.length > 0) {
    linksText += '\n';
    linksText += '\n<b>🔗 Ссылки:</b>';
    for (let link of nonIncludedLinks) {
      linksText += '\n' + link;
    }
  }
  return linksText;
}

export default addLinks;