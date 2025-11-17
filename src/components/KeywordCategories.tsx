import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Briefcase, GraduationCap, Wrench } from "lucide-react";

interface KeywordCategoriesProps {
  categories: {
    technical?: string[];
    soft?: string[];
    domain?: string[];
    tools?: string[];
  };
}

const KeywordCategories = ({ categories }: KeywordCategoriesProps) => {
  const categoryIcons = {
    technical: { icon: Code, color: "primary", label: "Technical Skills" },
    soft: { icon: Briefcase, color: "secondary", label: "Soft Skills" },
    domain: { icon: GraduationCap, color: "info", label: "Domain Knowledge" },
    tools: { icon: Wrench, color: "warning", label: "Tools & Technologies" },
  };

  const hasCategories = Object.values(categories).some((cat) => cat && cat.length > 0);

  if (!hasCategories) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Object.entries(categories).map(([key, keywords]) => {
        if (!keywords || keywords.length === 0) return null;

        const { icon: Icon, color, label } = categoryIcons[key as keyof typeof categoryIcons];

        return (
          <Card key={key} className={`border-${color}/20 bg-${color}/5`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className={`h-4 w-4 text-${color}`} />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className={`border-${color}/30 text-${color}`}>
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KeywordCategories;
