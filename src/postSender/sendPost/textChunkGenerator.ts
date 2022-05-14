import { assert } from "console";

export const TEXT_POST_LIMIT = 4096;
export const MEDIA_POST_LIMIT = 1024;
// 4064 is the limit of letters in one word.
// 32, respectively, is the limit of whitespace characters between words
// The sum of these numbers should be equal TEXT_POST_LIMIT
// Zeroes needed to split word or whitespace between words without break
const SPLIT_REGEX = /(\S{0,4064}\s{0,32})/gm


/**
 * Split text to chunks of TEXT_POST_LIMIT.
 * Edge cases (numbers for examples):
 * * Word with 4090 letters will be split by regex ^ and then joined
 * * Word with 4090 letters and 30 whitespaces after will be split by regex and remaining so (looks like a bug, but it's very rare case => wontfix)
 * * Word with 4097 or more letters will be split by regex ^ and  remaining so
 * @param text Text to split
 * @param hasMedia If set to true, last chank will be smaller than MEDIA_POST_LIMIT
 */
export default function* textGhunkGenerator(
  text: string,
  hasMedia = false,
): Generator<string, void, undefined> {
  let currentIndex = 0;
  const words = text.split(SPLIT_REGEX)
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
  if (hasMedia && cache.length > MEDIA_POST_LIMIT) yield "" // To send photo in last message
  return

  // // This code is for splitting by length unconditionally
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