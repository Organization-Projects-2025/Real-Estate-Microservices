import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { FaArrowLeft, FaHome, FaMapMarkerAlt } from 'react-icons/fa';

function PublicProjectProperties() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`http://127.0.0.1:3000/api/projects/${projectId}`).then(res => res.json()),
            fetch(`http://127.0.0.1:3000/api/developer-properties/project/${projectId}`).then(res => res.json())
        ])
            .then(([projectData, propertiesData]) => {
                if (projectData?.data?.project) {
                    setProject(projectData.data.project);
                }
                if (propertiesData?.data?.properties) {
                    setProperties(propertiesData.data.properties);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching project properties:', err);
                setLoading(false);
            });
    }, [projectId]);

    if (loading) {
        return (
            <div className="bg-[#121212] text-[#fff] min-h-screen">
                <Navbar />
                <div className="px-6 md:px-16 py-20">
                    <div className="animate-pulse">
                        <div className="h-12 bg-[#1a1a1a] rounded w-1/2 mb-10"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg h-60"></div>
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
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#703BF7] hover:text-white transition-colors mb-8 group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                {project && (
                    <div className="relative rounded-[3rem] overflow-hidden mb-16 border border-white/5 shadow-2xl">
                        {project.images && project.images.length > 0 ? (
                            <div className="h-[400px] w-full relative">
                                <img src={project.images[0]} alt={project.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                            </div>
                        ) : (
                            <div className="h-[200px] bg-gradient-to-r from-[#1a1a1a] to-[#252525] flex items-center justify-center">
                                <FaHome className="text-6xl text-gray-700" />
                            </div>
                        )}

                        <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="space-y-2">
                                <h1 className="text-5xl font-black uppercase tracking-tighter">{project.name}</h1>
                                <div className="flex items-center gap-2 text-[#703BF7] uppercase tracking-widest text-sm font-bold">
                                    <FaMapMarkerAlt /> {project.location}
                                </div>
                            </div>
                            <div className="px-6 py-2 bg-[#703BF7] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                {project.status}
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight">Available Units</h2>
                            <p className="text-gray-500 mt-1">Explore all listed properties within this development.</p>
                        </div>
                        <div className="px-6 py-2 bg-[#1a1a1a] border border-white/5 rounded-2xl text-[#703BF7] font-bold">
                            {properties.length} Total Properties
                        </div>
                    </div>

                    {properties.length === 0 ? (
                        <div className="text-center py-20 bg-[#1a1a1a] rounded-[2rem] border border-white/5">
                            <FaHome className="text-6xl text-gray-800 mx-auto mb-4" />
                            <p className="text-gray-500 italic">No properties are currently listed for this project.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property) => (
                                <PropertyCard
                                    key={property._id}
                                    property={{ ...property, media: property.images || [] }}
                                    to={`/developer-property/${property._id}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <footer className="bg-[#1a1a1a] py-10 text-center text-gray-500 border-t border-white/5 mt-20">
                <p>© 2025 Tamalk. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default PublicProjectProperties;
