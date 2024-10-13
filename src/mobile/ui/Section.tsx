import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
type SectionProps = {
  children: A,
  title?: string
};

export default function Section(props: SectionProps) {
  return (
    <Card className="rounded-none">
      <CardHeader className='px-4'>
        <CardTitle style={{ lineHeight: '1.25em' }}>{props.title}</CardTitle>
      </CardHeader>
      <CardContent className='px-4'>
        {props.children}
      </CardContent>
    </Card>
  )
}
