import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import React from 'react';
import { LuCheck } from 'react-icons/lu';

type CardPackageProps = {
  cardTitle: string;
  pricePackage: string;
  unitTime: string;
  description?: string;
  listPreferential?: string[];
  children?: React.ReactNode;
};

const CardPackage: React.FC<CardPackageProps> = ({
  pricePackage,
  listPreferential,
  cardTitle,
  unitTime,
  description,
}) => {
  return (
    <Card className="min-w-[300px] max-w-[330px] flex-1 border-2 hover:border-blue-300">
      <CardHeader className="pb-[15px]">
        <CardTitle className="text-lg font-bold text-primary_color">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="pb-4 text-xl font-bold text-[#596570]">
          <strong className="mr-2 text-[28px] font-bold text-primary_color">{pricePackage}</strong>/
          {unitTime}
        </p>
        <p className="text-sm font-medium">{description}</p>
        <Button className="mt-5 w-full bg-blue-600 hover:bg-blue-500">Mua ngay</Button>

        <div>
          <span className="inline-block pt-3 text-sm text-secondary">Ưu đãi bao gồm :</span>
          <ul className="mt-4">
            {listPreferential &&
              listPreferential.map((item) => (
                <li key={item} className="mb-2 flex items-center gap-x-2 text-sm">
                  <LuCheck className="text-blue-400" />
                  <span>{item}</span>
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPackage;
