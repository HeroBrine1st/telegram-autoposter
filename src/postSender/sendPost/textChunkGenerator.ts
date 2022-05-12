import { assert } from "console";

export const TEXT_POST_LIMIT = 4096;
export const PHOTO_POST_LIMIT = 1024;
// 4064 is the limit of letters in one word
// 32, respectively, is the limit of whitespace characters between words
// The sum of these numbers should be equal TEXT_POST_LIMIT
// Zeroes needed for splitting word or whitespace between words without break
const SPLIT_REGEX = /(\S{0,4064}\s{0,32})/gm

function* textGhunkGenerator(
  text: string,
  linksText: string,
  photoPost = false,
): Generator<string, void, undefined> {
  const fullText = (text + linksText)
  let currentIndex = 0;
  const words = fullText.split(SPLIT_REGEX)
  let cache = "";
  while (currentIndex < words.length) {
    assert(cache.length <= TEXT_POST_LIMIT)
    const newLen = cache.length + words[currentIndex].length
    if (newLen >= TEXT_POST_LIMIT) {
      yield cache
      cache = ""
    } else cache += words[currentIndex++]
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