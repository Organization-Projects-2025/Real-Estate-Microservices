import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import FeaturedProperties from '../components/FeaturedProperties';
import { FaStar, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllProperties } from '../services/propertyService';
import { getRandomReviews } from '../services/reviewService';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch properties
        const propertiesResponse = await getAllProperties();
        setProperties(propertiesResponse.data.properties);
        
        // Fetch reviews
        const reviewsResponse = await getRandomReviews(3);
        setReviews(reviewsResponse.data.reviews);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const customerSuccessData = [
    { label: 'Properties Sold', value: '200+' },
    { label: 'Happy Clients', value: '10K+' },
    { label: 'Cities Covered', value: '15+' },
  ];

  const features = [
    {
      title: 'Find Your Dream Property',
      description: 'Search properties with ease.',
    },
    {
      title: 'Connect with Agents',
      description: 'Get expert advice instantly.',
    },
    { title: 'Smart Financials', description: 'Explore loan options.' },
  ];

  const faqs = [
    {
      question: 'How do I search for properties?',
      answer: 'Use the search bar to enter your preferred location.'
    },
    {
      question: 'What documents do I need to sell?',
      answer: 'You\'ll need property deeds and identification.'
    },
    {
      question: 'How can I contact an agent?',
      answer: 'Use the "Find an Agent" feature.'
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-[#703BF7] rounded-lg hover:bg-[#5f2cc6] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-[#fff] min-h-screen">
      <Navbar />

      <section
        className="relative flex flex-col md:flex-row items-center justify-start px-6 md:px-16 py-20 bg-[#121212] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')`,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-[#000000] opacity-50"></div>
        <div className="relative max-w-xl space-y-6 z-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Agents. <br /> Tours. <br /> Loans. <br />{' '}
            <span className="text-[#703BF7]">Homes.</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Enter your preferred area and discover your dream property today.
          </p>
          <div className="flex items-center mt-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Enter an address, neighborhood, city, or ZIP code"
                className="w-full px-4 py-3 pl-12 pr-4 rounded-l-full text-black outline-none border-none focus:ring-2 focus:ring-[#703BF7]"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
            </div>
            <button className="bg-[#703BF7] px-6 py-3 rounded-r-full hover:bg-[#5f2cc6] transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Customer Success Data */}
      <section className="px-6 md:px-16 py-10 bg-[#1a1a1a]">
        <div className="flex justify-around text-center">
          {customerSuccessData.map((data, index) => (
            <div key={index}>
              <h3 className="text-3xl font-bold text-[#703BF7]">
                {data.value}
              </h3>
              <p className="text-gray-400">{data.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Carousel - Centered */}
      <section className="px-6 md:px-16 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose Tamalak?
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] p-6 rounded-lg text-center flex-1 max-w-xs shadow-lg transition-transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-400 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20 text-xl text-gray-300">
          Loading featured properties...
        </div>
      ) : (
        <FeaturedProperties properties={properties} />
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-[#1a1a1a] p-6 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-700 rounded"></div>
                </div>
              ))
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#1a1a1a] rounded-lg p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-[#333] hover:border-[#703BF7]"
                >
                  {/* Agent Section */}
                  <div className="mb-6 pb-6 border-b border-[#333]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#703BF7] p-2 rounded-full">
                        <FaUser className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#703BF7]">
                          {review.agent.firstName} {review.agent.lastName}
                        </h3>
                        <p className="text-sm text-gray-400">Real Estate Agent</p>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-[#703BF7]" />
                        <span className="text-gray-300">{review.reviewerName}</span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className="text-xl"
                            color={index < review.rating ? '#FFD700' : '#4B5563'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-center italic mb-4">"{review.reviewText}"</p>
                    <div className="text-sm text-gray-400 text-right">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400">
                <p className="text-xl">No reviews yet. Be the first to write one!</p>
                {isAuthenticated ? (
                  <Link
                    to="/write-review"
                    className="inline-block mt-4 bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] text-white px-6 py-2 rounded-lg hover:from-[#5f2cc6] hover:to-[#703BF7] transition-all duration-300"
                  >
                    Write a Review
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-block mt-4 bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] text-white px-6 py-2 rounded-lg hover:from-[#5f2cc6] hover:to-[#703BF7] transition-all duration-300"
                  >
                    Login to Write a Review
                  </Link>
                )}
              </div>
            )}
          </div>
          {reviews.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/reviews"
                className="inline-block bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] text-white px-8 py-3 rounded-lg hover:from-[#5f2cc6] hover:to-[#703BF7] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View All Reviews
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="px-6 md:px-16 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
