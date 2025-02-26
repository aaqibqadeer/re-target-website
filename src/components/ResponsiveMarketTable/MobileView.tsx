import React from 'react';
import MobileTableCard from './MobileTableCard';
import {SortControls} from './SortControls';

interface MobileViewProps {
  originalData: any[];
  sortedData: any[];
  sortField: string | null;
  handleSort: (field: string | null) => void;
}

export const MobileView: React.FC<MobileViewProps> = ({ 
  originalData,
  sortedData, 
  sortField, 
  handleSort 
}) => {
  // Determine which data to display - original data when no sorting is applied
  const displayData = sortField ? sortedData : originalData;
  
  return (
    <div className='lg:hidden'>
      <SortControls sortField={sortField} handleSort={handleSort} />
      
      <div className='space-y-4'>
        {displayData.map((item, index) => (
          <MobileTableCard key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};