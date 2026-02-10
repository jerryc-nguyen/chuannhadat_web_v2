'use client';

import { useState } from 'react';
import { IProductList } from '@common/types/product';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { ProductListItem } from './ProductListItem';

interface ProductImportDialogProps {
  products: IProductList[];
  onImport: (products: IProductList[]) => void;
  onCancel: () => void;
}

export function ProductImportDialog({ products, onImport, onCancel }: ProductImportDialogProps) {
  const [open, setOpen] = useState(true);

  const handleImport = () => {
    onImport(products);
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Products ({products.length} items)</DialogTitle>
          <DialogDescription>
            Review the products below and click Import to add them to your profile.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Product List */}
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleImport}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
