import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaBuilding, FaArrowRight } from 'react-icons/fa';

function DeveloperProperties() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:3000/api/auth/users/role/developer')
      .then(res => res.json())
      .then(userData => {
        if (userData?.data?.users) {
          setDevelopers(userData.data.users);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching developers:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#121212] text-[#fff] min-h-screen">
        <Navbar />
        <div className="px-6 md:px-16 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-[#1a1a1a] rounded w-1/2 mb-10 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] p-6 rounded-lg">
                  <div className="h-32 bg-[#252525] rounded-lg mb-4"></div>
                  <div className="h-6 bg-[#252525] rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-[#252525] rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-[#fff] min-h-screen">
      <Navbar />
      <section
        className="relative flex flex-col items-center justify-center px-6 md:px-16 py-24 bg-[#121212] bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab')`,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#703BF7] to-[#121212] opacity-70"></div>
        <div className="relative max-w-3xl space-y-8 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Properties by{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
              Developers
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Explore properties from trusted real estate developers
          </p>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-[#703BF7]/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-[#fff]/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-black uppercase tracking-tighter">Elite Developers</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Connect with the most prestigious real estate developers shaping the skyline of tomorrow.</p>
        </div>

        {developers.length === 0 ? (
          <p className="text-center text-gray-500 italic py-20">No developers found. Please check back later.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {developers.map((developer) => (
              <div
                key={developer._id}
                onClick={() => navigate(`/developer-properties/${developer._id}`)}
                className="group relative bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 hover:border-[#703BF7]/40 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
              >
                <div className="p-10 flex flex-col items-center text-center space-y-6">
                  {/* Developer Image */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#703BF7] shadow-2xl group-hover:scale-110 transition-transform duration-500 bg-[#252525]">
                    {developer.profilePicture ? (
                      <img src={developer.profilePicture} alt={developer.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#703BF7] to-[#1a1a1a]">
                        <FaBuilding className="text-5xl text-white opacity-80" />
                      </div>
                    )}
                  </div>

                  {/* Developer Info */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white group-hover:text-[#703BF7] transition-colors uppercase tracking-tight">
                      {developer.firstName} {developer.lastName}
                    </h3>
                    <p className="text-[#703BF7] text-[10px] font-black uppercase tracking-[0.2em]">Authorized Developer</p>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed opacity-80">
                    {developer.about || "Distinguished real estate development firm committed to architectural excellence and urban innovation."}
                  </p>

                  <div className="pt-6 w-full flex items-center justify-center border-t border-white/5">
                    <div className="text-[#703BF7] font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                      Explore Projects <FaArrowRight />
                    </div>
                  </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#703BF7]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#703BF7]/10 transition-all"></div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#1a1a1a] py-6 text-center text-gray-400">
        <p>© 2025 Tamalk. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default DeveloperProperties;
