export const TEXT_POST_LIMIT = 4096;
export const PHOTO_POST_LIMIT = 1024;
const LINK_REGEX = /\[([^[\]|]+)\|([^[\]]+)]/gm;
const LINK_SUBSTITUTION = `<a href="https://vk.com/$1">$2</a>`

function* textGhunkGenerator(
  text: string,
  linksText: string,
  photoPost = false,
): Generator<string, void, undefined> {
  const fullText = (text + linksText)
    .replace(LINK_REGEX, LINK_SUBSTITUTION) // This line speaks for itself, but just in case: Replace VK links to HTML links
  let currentIndex = 0;
  const words = fullText.split(/(\S+\s+)/g)
  let cache = "";
  while (currentIndex < words.length) {
    if (cache.length <= TEXT_POST_LIMIT) {
      const newLen = cache.length + words[currentIndex].length
      if (newLen >= TEXT_POST_LIMIT) {
        yield cache
        cache = ""
      } else cache += words[currentIndex++]
    } // Else is not required as cache will not be lengthier than TEXT_POST_LIMIT
  }
  yield cache
  if (photoPost && cache.length > PHOTO_POST_LIMIT) yield "" // To send photo in last message
  return

  // // This code for splitting by length unconditionally
  // const lastPostLimit = photoPost ? PHOTO_POST_LIMIT : TEXT_POST_LIMIT
  // while (currentIndex < fullText.length) {
  //   if (fullText.length - currentIndex < lastPostLimit) { // Last portion of string
  //     yield fullText.substring(currentIndex)
  //     return
  //   }
  //   yield fullText.substring(currentIndex, currentIndex + TEXT_POST_LIMIT)
  //   currentIndex += TEXT_POST_LIMIT
  // }
  // if (photoPost) yield "" // To send photo in last message
}

export default textGhunkGenerator;