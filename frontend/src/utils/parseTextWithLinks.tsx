const parseTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const elements = [];
  let lastIndex = 0;

  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const { index } = match;
    // Push text before URL
    if (index > lastIndex) {
      elements.push(<span key={lastIndex}>{text.slice(lastIndex, index)}</span>);
    }
    // Push URL as link
    const url = match[0];
    elements.push(
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{textDecoration: "underline" }}
      >
        {url}
      </a>
    );
    lastIndex = index + url.length;
  }

  // Push remaining text after last URL
  if (lastIndex < text.length) {
    elements.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
  }

  return elements;
};

export default parseTextWithLinks;
