import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ onSearch }) => {
  const handleSearch = (e) => {
    if (typeof onSearch === 'function') {
      onSearch(e.target.value);
    } else {
      console.warn('SearchBar: onSearch prop is not a function', onSearch);
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      <input
        type="text"
        placeholder="Search by address, type, price, or any feature..."
        onChange={handleSearch}
        className="w-full px-5 py-4 pl-14 pr-4 rounded-full text-black bg-white/90 backdrop-blur-sm outline-none border-none focus:ring-2 focus:ring-[#703BF7] transition-all duration-300 hover:shadow-lg hover:shadow-[#703BF7]/30"
      />
      <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-600 text-2xl" />
    </div>
  );
};

export default SearchBar;
