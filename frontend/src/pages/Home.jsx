import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import PropertyCard from '../components/property/PropertyCard';
import { PropertySkeleton } from '../components/common/LoadingSkeleton';
import { getFeaturedProperties } from '../api/properties';
import { getCities } from '../api/meta';

const CATEGORIES = [
  { name: 'Apartments', type: 'apartment', icon: 'apartment', count: '120+ Listings' },
  { name: 'Luxury Villas', type: 'villa', icon: 'villa', count: '45+ Penthouses' },
  { name: 'Commercial', type: 'commercial', icon: 'storefront', count: '80+ Offices' },
  { name: 'For Rent', listing_type: 'rent', icon: 'key', count: '150+ Properties' },
];

const Home = () => {
  const [activeCity, setActiveCity] = useState('Gurgaon');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProps, setFeaturedProps] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propsData, citiesData] = await Promise.all([
          getFeaturedProperties(6),
          getCities(),
        ]);
        setFeaturedProps(propsData || []);
        setCitiesList(citiesData || []);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?city=${encodeURIComponent(activeCity)}&q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <MobileShell activeCity={activeCity} onCityChange={setActiveCity}>
      
      {/* Desktop & Mobile Hero Search Section */}
      <section className="relative bg-primary-container text-white px-6 sm:px-10 pt-10 pb-14 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-primary/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <span className="text-secondary text-xs font-bold tracking-widest uppercase bg-secondary-container/20 px-3.5 py-1.5 rounded-full border border-secondary/30 inline-block mb-4">
            India's Luxury Real Estate Network
          </span>
          
          <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight tracking-tight">
            Find Your Sanctuary in <span className="text-secondary font-serif italic">{activeCity}</span>
          </h1>
          
          <p className="text-on-primary-container text-sm sm:text-base mt-3 leading-relaxed max-w-xl">
            Curated luxury villas, sky penthouses, and prime commercial hubs across India's top metropolitan cities.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleSearchSubmit} className="mt-8 bg-surface-container-lowest p-2 sm:p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-3 border border-surface-container-high">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
              <span className="material-symbols-outlined text-outline text-2xl">search</span>
              <input
                type="text"
                placeholder="Search by neighborhood, project, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-on-surface text-sm font-medium placeholder-outline focus:outline-none"
              />
            </div>
            
            <button
              type="submit"
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-on-secondary px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-lg">search</span>
              <span>Search Listings</span>
            </button>
          </form>

          {/* Key Metrics */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl text-secondary block">500+</span>
              <span className="text-[11px] sm:text-xs text-on-primary-container">Verified Properties</span>
            </div>
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl text-secondary block">100+</span>
              <span className="text-[11px] sm:text-xs text-on-primary-container">Top Agents</span>
            </div>
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl text-secondary block">4 Metros</span>
              <span className="text-[11px] sm:text-xs text-on-primary-container">Prime Markets</span>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Bar */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-on-surface">Browse Categories</h2>
            <p className="text-outline text-xs mt-0.5">Explore properties tailored to your lifestyle</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                const query = cat.type
                  ? `property_type=${cat.type}`
                  : `listing_type=${cat.listing_type}`;
                navigate(`/search?city=${encodeURIComponent(activeCity)}&${query}`);
              }}
              className="bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container-high p-4 rounded-2xl flex items-center gap-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/30 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors shrink-0">
                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-on-surface">{cat.name}</h4>
                <span className="text-[11px] text-outline font-medium block">{cat.count}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-on-surface">Featured Listings</h2>
            <p className="text-outline text-xs sm:text-sm mt-0.5">Handpicked luxury residences available in {activeCity}</p>
          </div>
          <Link
            to={`/search?city=${encodeURIComponent(activeCity)}`}
            className="text-xs sm:text-sm font-bold text-secondary hover:underline flex items-center gap-1 bg-secondary-container/20 px-3 py-1.5 rounded-full"
          >
            <span>View All Properties</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertySkeleton />
            <PropertySkeleton />
            <PropertySkeleton />
          </div>
        ) : featuredProps.length === 0 ? (
          <div className="bg-surface-container-low p-8 rounded-2xl text-center text-sm text-outline">
            No featured properties found in this area.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProps.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* Explore Cities Grid */}
      <section className="mt-12 mb-6">
        <div className="mb-6">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-on-surface">Top Real Estate Markets</h2>
          <p className="text-outline text-xs sm:text-sm mt-0.5">Explore active listings across major Indian cities</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {citiesList.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/search?city=${encodeURIComponent(c.name)}`)}
              className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm text-left flex items-center justify-between hover:border-secondary transition-all hover:shadow-md group"
            >
              <div>
                <h4 className="font-display font-semibold text-base text-on-surface group-hover:text-secondary transition-colors">
                  📍 {c.name}
                </h4>
                <p className="text-xs text-outline mt-1 font-medium">{c.count} active listings</p>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-secondary group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </button>
          ))}
        </div>
      </section>

    </MobileShell>
  );
};

export default Home;
