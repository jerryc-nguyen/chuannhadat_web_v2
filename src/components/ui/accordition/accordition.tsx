import {
  Accordion as RAccordion,
  Root as RRoot,
  AccordionSingleProps,
  AccordionMultipleProps,
} from '@radix-ui/react-accordion';

import { AccordionContent } from './content';
import { AccordionItem } from './item';
import { AccordionTrigger } from './trigger';

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

const Accordion = (props: AccordionProps) => {
  return <RAccordion {...props} />;
};

Accordion.Root = RRoot;
Accordion.Content = AccordionContent;
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;

export { Accordion };
