import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import PropertyFilters, { FilterButton } from '../components/PropertyFilters';

function Rent() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const propertiesPerPage = 6;

  // Extract search query from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  useEffect(() => {
    fetch('http://localhost:3000/api/properties')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data?.data?.properties && Array.isArray(data.data.properties)) {
          const rentProperties = data.data.properties.filter(
            (property) => property.listingType === 'rent'
          );
          setProperties(rentProperties);
          setFilteredProperties(rentProperties);
        } else {
          setProperties([]);
          setFilteredProperties([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching properties:', err);
        setProperties([]);
        setFilteredProperties([]);
        setLoading(false);
      });
  }, []);

  // Combined search and filter effect
  useEffect(() => {
    let result = [...properties];

    // Apply search term
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((property) =>
        [
          property.title || '',
          property.description || '',
          property.propertyType || '',
          property.subType || '',
          property.address?.city || '',
          property.address?.state || '',
          property.address?.country || '',
        ].some((field) => field.toLowerCase().includes(lowerSearch))
      );
    }

    // Apply filters
    if (activeFilters.priceMin) {
      result = result.filter((p) => p.price >= Number(activeFilters.priceMin));
    }
    if (activeFilters.priceMax) {
      result = result.filter((p) => p.price <= Number(activeFilters.priceMax));
    }
    if (activeFilters.bedrooms) {
      result = result.filter(
        (p) => p.features?.bedrooms >= Number(activeFilters.bedrooms)
      );
    }
    if (activeFilters.bathrooms) {
      result = result.filter(
        (p) => p.features?.bathrooms >= Number(activeFilters.bathrooms)
      );
    }
    if (activeFilters.propertyType) {
      result = result.filter(
        (p) => p.subType?.toLowerCase() === activeFilters.propertyType.toLowerCase()
      );
    }
    if (activeFilters.furnished) {
      result = result.filter(
        (p) => p.features?.furnished === activeFilters.furnished
      );
    }
    if (activeFilters.pool) {
      result = result.filter((p) => p.features?.pool === true);
    }
    if (activeFilters.pets) {
      result = result.filter((p) => p.features?.pets === true);
    }
    if (activeFilters.parking) {
      result = result.filter((p) => p.features?.garage > 0);
    }
    if (activeFilters.areaMin) {
      result = result.filter(
        (p) => p.area?.sqft >= Number(activeFilters.areaMin)
      );
    }
    if (activeFilters.areaMax) {
      result = result.filter(
        (p) => p.area?.sqft <= Number(activeFilters.areaMax)
      );
    }

    setFilteredProperties(result);
  }, [searchTerm, properties, activeFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    // Count active filters
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
  };

  if (loading) {
    return (
      <div className="bg-[#121212] text-[#fff] min-h-screen pt-20">
        <Navbar />
        <div className="px-6 md:px-16 py-20">
          <div className="animate-pulse">
            <div className="mb-16">
              <div className="h-12 bg-[#1a1a1a] rounded w-1/2 mb-6"></div>
              <div className="h-6 bg-[#1a1a1a] rounded w-3/4 mb-8"></div>
              <div className="flex">
                <div className="h-12 bg-[#1a1a1a] rounded-l-full w-full"></div>
                <div className="h-12 bg-[#703BF7] rounded-r-full w-32"></div>
              </div>
            </div>
            <h2 className="h-10 bg-[#1a1a1a] rounded w-1/3 mx-auto mb-10"></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg">
                  <div className="h-48 bg-[#252525] rounded-lg mb-4"></div>
                  <div className="h-6 bg-[#252525] rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-[#703BF7] rounded w-1/3 mb-4"></div>
                  <div className="h-10 bg-[#252525] rounded-lg w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  return (
    <div className="bg-[#121212] text-[#fff] min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center px-6 md:px-16 pt-32 pb-20 bg-[#121212] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#703BF7] to-[#121212] opacity-70"></div>
        <div className="relative max-w-3xl z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8">
            Find Your Perfect{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
              Rental Home
            </span>
          </h1>
          {/* Search Bar + Filter Button */}
          <div className="flex items-center gap-3 justify-center">
            <SearchBar onSearch={handleSearch} value={searchTerm} />
            <FilterButton
              onClick={() => setShowFilters(!showFilters)}
              isOpen={showFilters}
              activeCount={activeFiltersCount}
            />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-96 h-96 bg-[#703BF7]/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-[#fff]/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
        </div>
      </section>

      {/* Filter Panel - Expands below hero */}
      {showFilters && (
        <section className="px-6 md:px-16 py-6 bg-[#121212]">
          <div className="max-w-6xl mx-auto">
            <PropertyFilters
              onFilterChange={handleFilterChange}
              listingType="rent"
              isControlled={true}
              showPanel={true}
            />
          </div>
        </section>
      )}

      {/* Results indicator */}
      {filteredProperties.length !== properties.length && (
        <div className="px-6 md:px-16 py-4 bg-[#121212]">
          <p className="text-sm text-gray-400 text-center">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>
      )}

      {/* Properties Section */}
      <section className="px-6 md:px-16 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">
          Browse Properties for Rent
        </h2>
        {properties.length === 0 ? (
          <p className="text-center text-gray-400">
            No properties for rent are currently available.
          </p>
        ) : filteredProperties.length === 0 ? (
          <p className="text-center text-gray-400">
            No properties match your search. Try adjusting your search terms.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentProperties.map((property, index) => (
                <div
                  key={property._id}
                  className="animate-fadeInScale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-2xl text-white hover:text-[#703BF7] transition-colors duration-300 disabled:opacity-50"
                aria-label="Previous page"
              >
                ←
              </button>
              <div className="relative flex space-x-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative px-2 py-1 text-sm font-medium transition-colors duration-300 ${
                        currentPage === page
                          ? 'text-[#703BF7]'
                          : 'text-gray-400 hover:text-[#5f2cc6]'
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                      {currentPage === page && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#703BF7] transform scale-x-100 transition-transform duration-300 origin-left"></span>
                      )}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="text-2xl text-white hover:text-[#703BF7] transition-colors duration-300 disabled:opacity-50"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          </>
        )}
      </section>
      <footer className="bg-[#1a1a1a] py-6 text-center text-gray-400">
        <p>© 2025 Tamalk. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Rent;
