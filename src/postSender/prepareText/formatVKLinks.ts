const LINK_REGEX = /\[(?:https?:\/\/vk\.com\/)?([^[\]|]+)\|([^[\]]+)]/gm
const LINK_SUBSTITUTION = `<a href="https://vk.com/$1">$2</a>`

function formatVKLinks(text: string): string {
  return text.replace(LINK_REGEX, LINK_SUBSTITUTION)
}

export default formatVKLinks;