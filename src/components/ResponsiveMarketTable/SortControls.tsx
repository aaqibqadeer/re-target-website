import React from 'react';
import { FaSort, FaTimes } from 'react-icons/fa';

interface SortControlsProps {
  sortField: string | null;
  handleSort: (field: string | null) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({ sortField, handleSort }) => {
  const renderSortIcon = (field: string) => {
    return (
      <span className='ml-1'>
        <FaSort
          className={`inline ${
            sortField === field ? 'text-blue-500' : 'text-gray-400'
          }`}
        />
      </span>
    );
  };

  return (
    <div className='lg:hidden mb-4'>
      <div className='text-sm font-medium mb-2'>Sort by:</div>
      <div className='flex flex-wrap gap-2'>
        <button 
          onClick={() => handleSort('name')}
          className={`flex items-center px-3 py-1 text-sm rounded
            ${sortField === 'name' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Name {renderSortIcon('name')}
        </button>
        <button 
          onClick={() => handleSort('state')}
          className={`flex items-center px-3 py-1 text-sm rounded
            ${sortField === 'state' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          State {renderSortIcon('state')}
        </button>
        <button 
          onClick={() => handleSort('serviceArea')}
          className={`flex items-center px-3 py-1 text-sm rounded
            ${sortField === 'serviceArea' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Service Area {renderSortIcon('serviceArea')}
        </button>
        <button 
          onClick={() => handleSort('users')}
          className={`flex items-center px-3 py-1 text-sm rounded
            ${sortField === 'users' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Agents {renderSortIcon('users')}
        </button>
        
        {/* Clear sorting button - only visible when sorting is active */}
        {sortField && (
          <button 
            onClick={() => handleSort(null)}
            className="flex items-center px-3 py-1 text-sm rounded bg-red-100 text-red-800"
          >
            <FaTimes className="mr-1" /> Clear Sort
          </button>
        )}
      </div>
    </div>
  );
};