import GifType from '../types/mediaTypes/GifType';

function addGifs(gifs: GifType[], text: string, linksText: string): string {
  const nonIncludedGifs = gifs.filter(gif => !text.includes(gif.url));
  if (nonIncludedGifs.length > 0) {
    linksText += '\n';
    linksText += '\n<b>🖼 Гифки:</b>';
    for (let gif of nonIncludedGifs) {
      linksText += `\n<a href="${gif.url}">${gif.title}</a>`;
    }
  }
  return linksText;
}

export default addGifs;