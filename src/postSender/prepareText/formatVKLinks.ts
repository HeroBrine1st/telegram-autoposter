function formatVKLinks(text: string): string {
  const regexp = /\[(.+)\|(.+)\]/g;
  const formattedText = text.replace(regexp, (match, link, text) => {
    return `<a href="${link}">${text}</a>`;
  });
  return formattedText;
}

export default formatVKLinks;