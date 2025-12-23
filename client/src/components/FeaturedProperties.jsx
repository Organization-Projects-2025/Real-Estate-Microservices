import React from 'react';
import PropertyCard from './PropertyCard'; // adjust path if needed

const FeaturedProperties = ({ properties }) => {
  if (!Array.isArray(properties) || properties.length === 0) {
    return null; // or a loading spinner or placeholder
  }

  const featured = properties.slice(0, 3);

  return (
    <section className="px-6 md:px-16 py-20">
      <h2 className="text-3xl font-bold text-center mb-10">
        Featured Properties
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProperties;
