import LinkType from '../types/mediaTypes/LinkType';

async function getLink(link: any): Promise<LinkType> {
  return link.url;
}

export default getLink;