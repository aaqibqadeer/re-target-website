import React from 'react';
import { FaLink } from 'react-icons/fa';

interface MobileTableCardProps {
  item: any;
  index: number;
}

const MobileTableCard: React.FC<MobileTableCardProps> = ({ item, index }) => {
  // Format service area to highlight comma-separated values
  const formatServiceArea = (serviceArea: string) => {
    if (!serviceArea) return 'TBD';
    
    // Split by commas, trim whitespace, and join with styled spans
    return serviceArea.split(',').map((area, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span className="text-gray-400 mx-1">•</span>}
        <span>{area.trim()}</span>
      </React.Fragment>
    ));
  };

  return (
    <div
      className={`border rounded-lg flex flex-col p-5 ${
        index % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#FAFAFA]'
      }`}
    >
      {/* Header with centered icon */}
      <div className='flex flex-col items-center mb-5'>
        <div className='w-40 mb-3'>
          <img
            src={item.icon}
            alt={item.name}
            className='max-h-full max-w-full object-contain'
          />
        </div>
        <h3 className='font-semibold text-xl md:text-2xl text-center'>{item.name}</h3>
      </div>

      {/* Details grid */}
      <div className='grid grid-cols-2 gap-4 text-lg'>
        <div className='text-center'>
          <div className='text-base font-medium text-gray-600'>State</div>
          <div className='text-xl mt-1 font-medium'>{item.state.slice(0, 2).toUpperCase()}</div>
        </div>
        <div className='text-center'>
          <div className='text-base font-medium text-gray-600'>Agents</div>
          <div className='text-xl mt-1 font-medium'>{item.users.toLocaleString()}</div>
        </div>
        <div className='col-span-2 mt-2'>
          <div className='text-base font-medium text-gray-600'>Service Area</div>
          <div className='text-xl mt-1 leading-relaxed break-words'>
            {formatServiceArea(item.serviceArea)}
          </div>
        </div>
        <div className='col-span-2 mt-6 flex justify-center md:justify-start'>
          <a
            href={item.url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-md shadow text-lg font-medium hover:bg-blue-700 transition-colors w-full md:w-auto'
          >
            <FaLink className='mr-2 text-lg' /> View Rate Card
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileTableCard;