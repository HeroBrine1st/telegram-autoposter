import DocType from '../types/mediaTypes/DocType';

async function getDoc(doc: any): Promise<DocType> {
  return {
    title: doc.title,
    url: doc.url
  };
}

export default getDoc;