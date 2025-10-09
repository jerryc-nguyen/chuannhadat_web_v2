import React from 'react';
import { X } from 'lucide-react';

interface PanelHeaderProps {
  title: string;
  totalCount: number;
  onClose: () => void;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ title, totalCount, onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">
          {totalCount} listings found
        </p>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PanelHeader;
