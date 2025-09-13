import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { DollarSign, FileText, PhoneOutgoing } from "lucide-react";
import { useMemo } from "react";

interface FigureCardProps {
  title: React.ReactNode;
  content: React.ReactNode;
  contentClassName?: string;
  description?: React.ReactNode;
  icon?: CardIcons;
}

export const enum CardIcons {
  Money = 'Money',
  Document = 'Document',
  PhoneOutgoing = 'PhoneOutgoing'
}

export default function FigureCard({ title, content, description, icon, contentClassName }: FigureCardProps) {
  const iconNode = useMemo(() => {
    switch (icon) {
      case CardIcons.Money:
        return <DollarSign className="h-4 w-4 text-muted-foreground" />
      case CardIcons.Document:
        return <FileText className="h-4 w-4 text-muted-foreground" />
      case CardIcons.PhoneOutgoing:
        return <PhoneOutgoing className="h-4 w-4 text-muted-foreground" />
      default:
        break;
    }
  }, [])
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-secondary">
          {title}
        </CardTitle>
        {iconNode}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${contentClassName}`}>{content}</div>
        <p className="text-xs text-secondary">
          {description}
        </p>
      </CardContent>
    </Card >
  );
}
