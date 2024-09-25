import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import Modal from './components/Modal';
import Filter from './components/Filter';

interface Car {
  id: number;
  model: string;
  make: string;
  year: number;
  transmission: string;
  category: string;
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

const retrieveData = async (): Promise<Car[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import('./cars.json');
  return data.default;
};

const App: React.FC = () => {
  const [data, setData] = useState<Car[]>([]);
  const [filteredData, setFilteredData] = useState<Car[]>([]);
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [styleType, setStyleType] = useState('zebra');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Car; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const carsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / carsPerPage);

  const makes = ['All', ...new Set(data.map((item) => item.make))];
  const transmissions = ['All', ...new Set(data.map((item) => item.transmission))];

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await retrieveData();
      setData(fetchedData);
      setFilteredData(fetchedData.slice(0, carsPerPage));
    };

    loadData();
  }, []);

  useEffect(() => {
    setFilteredData(data.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage));
  }, [data, currentPage]);

  const filterData = async (make: string, transmission: string) => {
    const fetchedData = await retrieveData();
    let newData = fetchedData;

    if (make !== 'All') {
      newData = newData.filter((item) => item.make === make);
    }

    if (transmission !== 'All') {
      newData = newData.filter((item) => item.transmission === transmission);
    }

    setData(newData);
    setCurrentPage(1);
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

    const sortedData = [...filteredData].sort((a, b) => {
      if (key === 'year') {
        return direction === 'ascending' ? b[key] - a[key] : a[key] - b[key];
      } else {
        const valueA = a[key];
        const valueB = b[key];

        if (String(valueA) < String(valueB)) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (String(valueA) > String(valueB)) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }
    });

    setFilteredData(sortedData);
    setSortConfig({ key, direction });
    setCurrentPage(1);
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
        <h1 className="text-3xl font-bold mb-4 text-PrimeNearshore">Richard Nkulu Application</h1>

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
          className="mb-4 px-4 py-2 bg-PrimeNearshore text-white rounded-3xl 
          shadow hover:bg-PrimeNearshoreHover transition duration-300"
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
            className="px-4 py-2 bg-PrimeNearshore hover:cursor-pointer text-white rounded-3xl 
            shadow hover:bg-PrimeNearshoreHover transition duration-300"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 ">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-PrimeNearshore hover:cursor-pointer text-white rounded-3xl 
            shadow hover:bg-PrimeNearshoreHover transition duration-300"
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
