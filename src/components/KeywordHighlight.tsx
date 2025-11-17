import { Badge } from "@/components/ui/badge";

interface KeywordHighlightProps {
  text: string;
  matchedKeywords: string[];
  missingKeywords: string[];
}

const KeywordHighlight = ({ text, matchedKeywords, missingKeywords }: KeywordHighlightProps) => {
  if (!text) return <p className="text-muted-foreground">No resume text available</p>;

  const highlightText = () => {
    let highlightedText = text;
    const keywords = [...matchedKeywords, ...missingKeywords];

    // Sort by length (longest first) to avoid partial matches
    keywords.sort((a, b) => b.length - a.length);

    keywords.forEach((keyword) => {
      const isMatched = matchedKeywords.includes(keyword);
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const className = isMatched
        ? "bg-success/20 text-success-foreground px-1 rounded font-medium"
        : "bg-warning/20 text-warning-foreground px-1 rounded font-medium";

      highlightedText = highlightedText.replace(
        regex,
        `<mark class="${className}">$&</mark>`
      );
    });

    return highlightedText;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Badge className="bg-success/20 text-success">Matched Keywords</Badge>
        <Badge className="bg-warning/20 text-warning">Missing Keywords</Badge>
      </div>
      <div
        className="prose prose-sm max-w-none text-foreground bg-muted/30 p-4 rounded-lg overflow-auto max-h-96"
        dangerouslySetInnerHTML={{ __html: highlightText() }}
      />
    </div>
  );
};

export default KeywordHighlight;
