import VideoType from '../types/mediaTypes/VideoType';
import prepareForHTML from '../prepareText/prepareForHTML';

function addVideos(videos: VideoType[], text: string, linksText: string): string {
  const nonIncludedVideos = videos.filter(video => {
    return !text.includes(prepareForHTML(video.url))
  });
  if (nonIncludedVideos.length > 0) {
    linksText += '\n';
    linksText += '\n<b>🎞 Видео:</b>';
    for (let video of nonIncludedVideos) {
      linksText += `\n<a href="${video.url}">${video.title}</a>`;
    }
  }
  return linksText;
}

export default addVideos;