import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import Modal from './components/Modal';
import Filter from './components/Filter';
import carsData from './cars.json';

interface Car {
  id: number;
  model: string;
  make: string;
  year: number;
  transmission: string;
  category: string;
  country_of_origin: string;
  city?: string; // Optional
  price_range: string;
  fuel_type: string;
  details?: {
    engine: string;
    horsepower: string;
    torque: string;
  };
}

const App: React.FC = () => {
  const [data, setData] = useState<Car[]>(carsData);
  const [filteredData, setFilteredData] = useState(data.slice(0, 10));
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [styleType, setStyleType] = useState('zebra');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Car; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const carsPerPage = 10;
  const totalPages = Math.ceil(data.length / carsPerPage);

  const makes = ['All', ...new Set(data.map((item) => item.make))];
  const transmissions = ['All', ...new Set(data.map((item) => item.transmission))];

  useEffect(() => {
    setFilteredData(data.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage));
  }, [data, currentPage]);

  const retrieveData = (make: string, transmission: string) => {
    let newData = carsData;

    if (make !== 'All') {
      newData = newData.filter((item) => item.make === make);
    }

    if (transmission !== 'All') {
      newData = newData.filter((item) => item.transmission === transmission);
    }

    return newData;
  };

  const filterData = (make: string, transmission: string) => {
    const newData = retrieveData(make, transmission);
    setData(newData);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleMakeChange = (value: string) => {
    setSelectedMake(value);
    filterData(value, selectedTransmission);
  };

  const handleTransmissionChange = (value: string) => {
    setSelectedTransmission(value);
    filterData(selectedMake, value);
  };

  const toggleStyle = () => {
    setStyleType((prevStyle) => (prevStyle === 'zebra' ? 'plain' : 'zebra'));
  };

  const sortData = (key: keyof Car) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedData = [...data].sort((a, b) => {
      if (key === 'year') {
        return direction === 'ascending' ? b[key] - a[key] : a[key] - b[key];
      } else {
        const valueA = a[key];
        const valueB = b[key];

        // Use string comparison for all string-based keys
        if (String(valueA) < String(valueB)) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (String(valueA) > String(valueB)) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }
    });

    setData(sortedData);
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page after sorting
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="relative">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className={`container mx-auto p-4 ${isModalOpen ? 'blur-sm' : ''}`}>
        <h1 className="text-3xl font-bold mb-4 text-PrimeNearshore">Vehicles Data Table</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Filter 
            label="Make" 
            options={makes} 
            selectedOption={selectedMake} 
            onChange={handleMakeChange} 
          />
          <Filter 
            label="Transmission" 
            options={transmissions} 
            selectedOption={selectedTransmission} 
            onChange={handleTransmissionChange} 
          />
        </div>

        <button
          className="mb-4 px-4 py-2 bg-PrimeNearshore text-white rounded-3xl shadow hover:bg-PrimeNearshoreHover transition duration-300"
          onClick={toggleStyle}
        >
          Toggle Style
        </button>

        <Table 
          data={filteredData} 
          onSort={sortData} 
          styleType={styleType}
          sortConfig={sortConfig} 
        />

        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-PrimeNearshore hover:cursor-pointer text-white rounded-3xl shadow hover:bg-PrimeNearshoreHover transition duration-300"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 ">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-PrimeNearshore hover:cursor-pointer text-white rounded-3xl shadow hover:bg-PrimeNearshoreHover transition duration-300"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;