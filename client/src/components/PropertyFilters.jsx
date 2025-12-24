import { useState, useEffect } from 'react';
import {
  FaBed,
  FaBath,
  FaSwimmingPool,
  FaDog,
  FaCar,
  FaTimes,
} from 'react-icons/fa';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';

// Just the filter button - to be placed next to search bar
export const FilterButton = ({ onClick, isOpen, activeCount }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg whitespace-nowrap ${
      isOpen || activeCount > 0
        ? 'bg-[#703BF7] text-white shadow-[#703BF7]/30'
        : 'bg-white/90 text-gray-800 hover:bg-white'
    }`}
  >
    <HiAdjustmentsHorizontal className="text-xl" />
    <span>Filters</span>
    {activeCount > 0 && (
      <span className="ml-1 px-2 py-0.5 text-xs bg-[#703BF7] text-white rounded-full font-bold">
        {activeCount}
      </span>
    )}
  </button>
);

const PropertyFilters = ({ onFilterChange, listingType = 'sale', isControlled = false, showPanel = false }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [selectedPriceRange, setSelectedPriceRange] = useState('-');

  // Use internal state or controlled state
  const isOpen = isControlled ? showPanel : showFilters;

  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    furnished: '',
    pool: false,
    pets: false,
    parking: false,
  });

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.propertyType) count++;
    if (filters.furnished) count++;
    if (filters.pool) count++;
    if (filters.pets) count++;
    if (filters.parking) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (rangeValue) => {
    setSelectedPriceRange(rangeValue);
    const [min, max] = rangeValue.split('-');
    const newFilters = { ...filters, priceMin: min, priceMax: max };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      furnished: '',
      pool: false,
      pets: false,
      parking: false,
    };
    setFilters(clearedFilters);
    setSelectedPriceRange('-');
    onFilterChange(clearedFilters);
  };

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condo' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'townhouse', label: 'Townhouse' },
  ];

  const bedroomOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];
  const bathroomOptions = ['Any', '1+', '2+', '3+', '4+'];

  const priceRanges =
    listingType === 'sale'
      ? [
          { min: '', max: '', label: 'Any Price' },
          { min: '0', max: '500000', label: 'Under $500K' },
          { min: '500000', max: '1000000', label: '$500K - $1M' },
          { min: '1000000', max: '2000000', label: '$1M - $2M' },
          { min: '2000000', max: '5000000', label: '$2M - $5M' },
          { min: '5000000', max: '', label: '$5M+' },
        ]
      : [
          { min: '', max: '', label: 'Any Price' },
          { min: '0', max: '2000', label: 'Under $2K/mo' },
          { min: '2000', max: '5000', label: '$2K - $5K/mo' },
          { min: '5000', max: '10000', label: '$5K - $10K/mo' },
          { min: '10000', max: '20000', label: '$10K - $20K/mo' },
          { min: '20000', max: '', label: '$20K+/mo' },
        ];

  return (
    <div className="w-full">
      {/* Filter Button - Only show if not controlled */}
      {!isControlled && (
        <div className="flex justify-center">
          <FilterButton
            onClick={() => setShowFilters(!showFilters)}
            isOpen={showFilters}
            activeCount={activeFiltersCount}
          />
        </div>
      )}

      {/* Expanded Filter Panel */}
      {isOpen && (
        <div className="mt-6 bg-[#1a1a1a] rounded-2xl border border-gray-700 p-6 shadow-2xl animate-fadeIn">
          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price Range
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#252525] border border-gray-600 rounded-xl text-white focus:border-[#703BF7] focus:outline-none focus:ring-1 focus:ring-[#703BF7] transition-all cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                }}
              >
                {priceRanges.map((range, idx) => (
                  <option
                    key={idx}
                    value={`${range.min}-${range.max}`}
                    className="bg-[#252525] text-white"
                  >
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  handleFilterChange('propertyType', e.target.value)
                }
                className="w-full px-4 py-3 bg-[#252525] border border-gray-600 rounded-xl text-white focus:border-[#703BF7] focus:outline-none focus:ring-1 focus:ring-[#703BF7] transition-all cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                }}
              >
                {propertyTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                    className="bg-[#252525] text-white"
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaBed className="inline mr-2 text-[#703BF7]" />
                Bedrooms
              </label>
              <div className="flex gap-1">
                {bedroomOptions.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() =>
                      handleFilterChange('bedrooms', idx === 0 ? '' : String(idx))
                    }
                    className={`flex-1 py-2.5 text-sm rounded-lg transition-all font-medium ${
                      (idx === 0 && filters.bedrooms === '') ||
                      filters.bedrooms === String(idx)
                        ? 'bg-[#703BF7] text-white'
                        : 'bg-[#252525] text-gray-300 hover:bg-[#303030]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaBath className="inline mr-2 text-[#703BF7]" />
                Bathrooms
              </label>
              <div className="flex gap-1">
                {bathroomOptions.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() =>
                      handleFilterChange('bathrooms', idx === 0 ? '' : String(idx))
                    }
                    className={`flex-1 py-2.5 text-sm rounded-lg transition-all font-medium ${
                      (idx === 0 && filters.bathrooms === '') ||
                      filters.bathrooms === String(idx)
                        ? 'bg-[#703BF7] text-white'
                        : 'bg-[#252525] text-gray-300 hover:bg-[#303030]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities Row */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Amenities
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleFilterChange('pool', !filters.pool)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium ${
                  filters.pool
                    ? 'bg-[#703BF7] text-white'
                    : 'bg-[#252525] text-gray-300 hover:bg-[#303030]'
                }`}
              >
                <FaSwimmingPool /> Pool
              </button>
              <button
                onClick={() => handleFilterChange('pets', !filters.pets)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium ${
                  filters.pets
                    ? 'bg-[#703BF7] text-white'
                    : 'bg-[#252525] text-gray-300 hover:bg-[#303030]'
                }`}
              >
                <FaDog /> Pets Allowed
              </button>
              <button
                onClick={() => handleFilterChange('parking', !filters.parking)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium ${
                  filters.parking
                    ? 'bg-[#703BF7] text-white'
                    : 'bg-[#252525] text-gray-300 hover:bg-[#303030]'
                }`}
              >
                <FaCar /> Parking
              </button>

              {/* Furnished Dropdown */}
              <select
                value={filters.furnished}
                onChange={(e) =>
                  handleFilterChange('furnished', e.target.value)
                }
                className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-medium appearance-none pr-10 ${
                  filters.furnished
                    ? 'bg-[#703BF7] text-white'
                    : 'bg-[#252525] text-gray-300 border border-gray-600'
                } focus:outline-none`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${filters.furnished ? 'white' : '%239ca3af'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '16px',
                }}
              >
                <option value="" className="bg-[#252525] text-white">
                  Furnished: Any
                </option>
                <option value="fully" className="bg-[#252525] text-white">
                  Fully Furnished
                </option>
                <option value="partly" className="bg-[#252525] text-white">
                  Partly Furnished
                </option>
                <option value="none" className="bg-[#252525] text-white">
                  Unfurnished
                </option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                <FaTimes /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PropertyFilters;
