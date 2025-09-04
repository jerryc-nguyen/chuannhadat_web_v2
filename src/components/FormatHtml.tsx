import { formatRealEstateText } from "@common/stringHelpers";

const FormatHtml = ({ content }: { content: string }) => {
  if (!content) return null;

  const formattedContent = formatRealEstateText(content);
  return (
    <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
  );
}

export default FormatHtml
