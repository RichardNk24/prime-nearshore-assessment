import React from 'react';
import imageModal from '../assets/image-spreadsheet.svg'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    }

    const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className=" fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
            <img src={imageModal} alt='image-spreadsheet' className='w-80 p-1 mx-auto' />
            <h2 className="text-2xl font-bold text-center text-PrimeNearshore mb-4">Richard Nkulu Application</h2>
            <p className="text-gray-700 text-center mb-6">
            This application offers an intuitive interface for viewing, sorting and filtering car model data. Navigate easily between pages and enjoy a fluid, modern user experience.
            </p>
            <button
            onClick={onClose}
            className="block mx-auto px-4 py-2 bg-PrimeNearshore text-white 
            rounded-full shadow-lg hover:bg-PrimeNearshoreHover transition duration-300"
            >
            Get Started
            </button>
        </div>
        </div>
    );
};

export default Modal;