import React, { useState } from 'react';
import { MdOutlineArrowCircleRight, 
  MdOutlineArrowCircleLeft, 
  MdOutlineArrowCircleUp, 
  MdOutlineArrowCircleDown } from 'react-icons/md';
import { LuArrowDownUp } from "react-icons/lu";

interface Car {
  id: number;
  category: string;
  make: string;
  model: string;
  year: number;
  transmission: string;
  country_of_origin: string;
  city?: string;
  price_range: string;
  fuel_type: string;
  details?: {
    engine: string;
    horsepower: string;
    torque: string;
  };
}

interface TableProps {
    data: Car[];
    sortConfig?: { key: keyof Car; direction: 'ascending' | 'descending' } | null;
    onSort: (key: keyof Car) => void;
    styleType: string;
  }

const Table: React.FC<TableProps> = ({ data, onSort, styleType }) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [expandedCols, setExpandedCols] = useState<{ [key: string]: boolean }>({});

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prevState => {
      const newSet = new Set(prevState);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleColExpansion = (key: string) => {
    setExpandedCols(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <div className="relative overflow-hidden">
      <div className="relative overflow-y-auto max-h-80 mt-[-7px]">
        <table className={`min-w-full border-collapse ${styleType === 'zebra' ? 'table-auto' : 'border border-gray-300 bg-white'}`}>
          <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="border border-gray-300 p-4 text-left">Category</th>
              <th className="border border-gray-300 p-4 text-left cursor-pointer" onClick={() => onSort('make')}>
                Make <LuArrowDownUp className='inline-block ml-2' />
              </th>
              <th className="border border-gray-300 p-4 text-left cursor-pointer" onClick={() => onSort('model')}>
                Model <LuArrowDownUp className='inline-block ml-2' />
              </th>
              <th className="border border-gray-300 p-4 text-left cursor-pointer" onClick={() => onSort('year')}>
                Year <LuArrowDownUp className='inline-block ml-2' />
              </th>
              <th
                className="border border-gray-300 p-4 text-left cursor-pointer"
                onClick={() => toggleColExpansion('location')}
              >
                {expandedCols['location'] ? (
                  <>
                    Location
                    <MdOutlineArrowCircleLeft className="inline-block ml-2" />
                  </>
                ) : (
                  <>
                    Location
                    <MdOutlineArrowCircleRight className="inline-block ml-2" />
                  </>
                )}
              </th>
              {expandedCols['location'] && (
                <>
                  <th className="border border-gray-300 p-4 text-left">Country</th>
                  <th className="border border-gray-300 p-4 text-left">City</th>
                </>
              )}
              <th className="border border-gray-300 p-4 text-left">Price Range</th>
              <th className="border border-gray-300 p-4 text-left">Fuel Type</th>
            </tr>
          </thead>
          <tbody className="relative">
            {data.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  className={`${styleType === 'zebra' ? 'even:bg-gray-50 odd:bg-white' : ''}
                    hover:bg-gray-100 focus:bg-indigo-100 transform transition-transform duration-300 hover:scale-102`}
                >
                  <td className="border border-gray-300 p-4">
                    {row.category}
                    {row.details && (
                      <button
                        className="ml-2"
                        onClick={() => toggleRowExpansion(row.id)}
                        aria-label={expandedRows.has(row.id) ? 'Collapse' : 'Expand'}
                      >
                        {expandedRows.has(row.id) ? (
                          <MdOutlineArrowCircleUp className="inline-block" />
                        ) : (
                          <MdOutlineArrowCircleDown className="inline-block" />
                        )}
                      </button>
                    )}
                  </td>
                  <td className="border border-gray-300 p-4">{row.make}</td>
                  <td className="border border-gray-300 p-4">{row.model}</td>
                  <td className="border border-gray-300 p-4">{row.year}</td>
                  <td className="border border-gray-300 p-4">
                    {expandedCols['location'] ? (
                      <>
                        <span>Click to close</span>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleColExpansion('location')}
                          aria-label={expandedCols['location'] ? 'Collapse' : 'Expand'}
                        >
                          {expandedCols['location'] ? (
                            <MdOutlineArrowCircleUp className="inline-block" />
                          ) : (
                            <MdOutlineArrowCircleDown className="inline-block" />
                          )}
                        </button>
                        {' '}
                        Click to expand
                      </>
                    )}
                  </td>
                  {expandedCols['location'] && (
                    <>
                      <td className="border border-gray-300 p-4">{row.country_of_origin}</td>
                      <td className="border border-gray-300 p-4">{row.city}</td>
                    </>
                  )}
                  <td className="border border-gray-300 p-4">{row.price_range}</td>
                  <td className="border border-gray-300 p-4">{row.fuel_type}</td>
                </tr>
                {expandedRows.has(row.id) && row.details && (
                  <tr className="bg-gray-100">
                    <td colSpan={expandedCols['location'] ? 9 : 7} className="p-4 border-t border-gray-300">
                      <div className="grid grid-cols-3 gap-4">
                        <div><strong>Engine:</strong> {row.details.engine}</div>
                        <div><strong>Horsepower:</strong> {row.details.horsepower}</div>
                        <div><strong>Torque:</strong> {row.details.torque}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
