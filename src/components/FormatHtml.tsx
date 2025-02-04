import { formatRealEstateText } from "@common/stringHelpers";
import { genKey } from "@common/utils";

const FormatHtml = ({ content }: { content: string }) => {
  return (
    content &&
    formatRealEstateText(content).split('\n').map((line: string, index: number) => {
      if (line.trim() === '') return null;
      if (!line.startsWith('•')) {
        return <p key={genKey(index)}>{line}</p>;
      } else {
        const newLine = line.replace('•', '');
        return (
          <li className="list-item pl-3" key={genKey(index)}>
            {newLine}
          </li>
        );
      }
    })
  )
}

export default FormatHtml
