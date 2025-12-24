import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { FaArrowLeft, FaBuilding } from 'react-icons/fa';

function DeveloperPropertiesDetail() {
  const { developerId } = useParams();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We catch errors per-fetch to ensure the whole page doesn't fail if one optional service is down
    const fetchDevProfile = fetch(`http://127.0.0.1:3000/api/developers/${developerId}`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null);

    const fetchProjHierarchy = fetch(`http://127.0.0.1:3000/api/projects-with-properties/developer/${developerId}`)
      .then(res => res.ok ? res.json() : { data: { projects: [] } })
      .catch(() => ({ data: { projects: [] } }));

    const fetchUserInfo = fetch(`http://127.0.0.1:3000/api/auth/users/${developerId}`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null);

    Promise.all([fetchDevProfile, fetchProjHierarchy, fetchUserInfo])
      .then(([devData, projData, userData]) => {
        if (devData?.data?.developer) {
          setDeveloper(prev => ({ ...prev, ...devData.data.developer }));
        }
        if (userData?.data?.user) {
          setDeveloper(prev => ({
            ...prev,
            ...userData.data.user,
            displayName: `${userData.data.user.firstName} ${userData.data.user.lastName}`
          }));
        }
        if (projData?.data?.projects) {
          setProjects(projData.data.projects);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Critical Error fetching data:', err);
        setLoading(false);
      });
  }, [developerId]);

  if (loading) {
    return (
      <div className="bg-[#121212] text-[#fff] min-h-screen">
        <Navbar />
        <div className="px-6 md:px-16 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-[#1a1a1a] rounded w-1/2 mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg">
                  <div className="h-48 bg-[#252525] rounded-lg mb-4"></div>
                  <div className="h-6 bg-[#252525] rounded w-3/4 mb-2"></div>
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

      <section className="px-6 md:px-16 py-10">
        <button
          onClick={() => navigate('/developer-properties')}
          className="flex items-center gap-2 text-[#703BF7] hover:text-white transition-colors mb-6"
        >
          <FaArrowLeft /> Back to Developers
        </button>

        {developer && (
          <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-10 border border-[#252525]">
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] rounded-full overflow-hidden border-2 border-[#703BF7]">
                {developer.profilePicture ? (
                  <img src={developer.profilePicture} alt={developer.displayName} className="w-full h-full object-cover" />
                ) : (
                  <FaBuilding className="text-5xl text-white" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{developer.displayName || developer.name}</h1>
                {developer.description && (
                  <p className="text-gray-400 mb-4">{developer.description}</p>
                )}
                {developer.contact && (
                  <div className="text-gray-500 text-sm space-y-1">
                    {developer.contact.email && (
                      <p>Email: {developer.contact.email}</p>
                    )}
                    {developer.contact.phone && (
                      <p>Phone: {developer.contact.phone}</p>
                    )}
                    {developer.contact.website && (
                      <p>Website: <a href={developer.contact.website} target="_blank" rel="noopener noreferrer" className="text-[#703BF7] hover:underline">{developer.contact.website}</a></p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Projects Portfolio
          </h2>
          <div className="px-6 py-2 bg-[#1a1a1a] border border-white/5 rounded-2xl text-[#703BF7] font-bold">
            {projects.length} Active Projects
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-[#1a1a1a] rounded-[2rem] border border-white/5">
            <FaBuilding className="text-6xl text-gray-800 mx-auto mb-4" />
            <p className="text-gray-500 italic">No projects are currently listed by this developer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="group relative bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 hover:border-[#703BF7]/40 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
              >
                {/* Project Image */}
                <div className="aspect-video overflow-hidden relative">
                  {project.images && project.images.length > 0 ? (
                    <img src={project.images[0]} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-[#252525] flex items-center justify-center">
                      <FaBuilding className="text-5xl text-gray-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c1d] via-transparent to-transparent opacity-80"></div>

                  {/* Status Badge */}
                  <div className="absolute top-6 right-6 px-4 py-1.5 bg-[#703BF7] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {project.status}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-8 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white group-hover:text-[#703BF7] transition-colors uppercase tracking-tight">{project.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                      Location: <span className="text-white">{project.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed opacity-80">{project.description}</p>

                  <div className="pt-6 flex items-center justify-between border-t border-white/5">
                    <div className="text-[#703BF7] font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                      View Properties <FaArrowLeft className="rotate-180" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#1a1a1a] py-6 text-center text-gray-400 mt-20">
        <p>© 2025 Tamalk. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default DeveloperPropertiesDetail;
