import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
type SectionProps = {
  children: A,
  title?: string
};

export default function Section(props: SectionProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {props.children}
      </CardContent>
    </Card>
  )
}
