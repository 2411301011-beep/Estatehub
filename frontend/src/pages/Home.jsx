import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import PropertyCard from '../components/property/PropertyCard';
import { PropertySkeleton } from '../components/common/LoadingSkeleton';
import { getFeaturedProperties } from '../api/properties';
import { getCities } from '../api/meta';

const CATEGORIES = [
  { name: 'Apartments', type: 'apartment', icon: 'apartment' },
  { name: 'Villas', type: 'villa', icon: 'villa' },
  { name: 'Commercial', type: 'commercial', icon: 'storefront' },
  { name: 'For Rent', listing_type: 'rent', icon: 'key' },
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
      
      {/* Hero Search Section */}
      <section className="relative bg-primary-container text-white px-5 pt-8 pb-10 rounded-b-3xl overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-sm">
          <span className="text-secondary text-[11px] font-bold tracking-widest uppercase bg-secondary-container/20 px-3 py-1 rounded-full border border-secondary/30 inline-block mb-3">
            Premium Indian Properties
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl leading-tight tracking-tight">
            Find Your Dream Sanctuary in <span className="text-secondary font-serif italic">{activeCity}</span>
          </h1>
          <p className="text-on-primary-container text-xs mt-2 leading-relaxed">
            Curated villas, luxury penthouses, and commercial hubs across India's top metros.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleSearchSubmit} className="mt-6 bg-surface-container-lowest p-2 rounded-2xl shadow-2xl flex items-center gap-2 border border-surface-container-high">
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5">
              <span className="material-symbols-outlined text-outline text-xl">search</span>
              <input
                type="text"
                placeholder="Search area, project, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-on-surface text-xs font-medium placeholder-outline focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary/90 text-on-secondary px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1 shrink-0"
            >
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-base text-on-surface">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                const query = cat.type
                  ? `property_type=${cat.type}`
                  : `listing_type=${cat.listing_type}`;
                navigate(`/search?city=${encodeURIComponent(activeCity)}&${query}`);
              }}
              className="bg-surface-container-lowest hover:bg-surface-container border border-surface-container-high p-3 rounded-2xl flex flex-col items-center gap-1.5 shadow-sm transition-all hover:scale-105 group"
            >
              <div className="w-10 h-10 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-xl">{cat.icon}</span>
              </div>
              <span className="text-[11px] font-semibold text-on-surface line-clamp-1">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-lg text-on-surface">Featured Listings</h2>
            <p className="text-outline text-xs">Handpicked luxury properties for you</p>
          </div>
          <Link
            to={`/search?city=${encodeURIComponent(activeCity)}`}
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <PropertySkeleton />
            <PropertySkeleton />
          </div>
        ) : featuredProps.length === 0 ? (
          <div className="bg-surface-container-low p-6 rounded-2xl text-center text-xs text-outline">
            No featured properties found in this area.
          </div>
        ) : (
          <div className="space-y-4">
            {featuredProps.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* Explore Cities */}
      <section className="px-4 mt-8 mb-6">
        <h2 className="font-display font-semibold text-lg text-on-surface mb-3">Top Markets</h2>
        <div className="grid grid-cols-2 gap-3">
          {citiesList.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/search?city=${encodeURIComponent(c.name)}`)}
              className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high shadow-sm text-left flex items-center justify-between hover:border-secondary transition-colors group"
            >
              <div>
                <h4 className="font-display font-semibold text-sm text-on-surface group-hover:text-secondary transition-colors">
                  📍 {c.name}
                </h4>
                <p className="text-[11px] text-outline mt-0.5">{c.count} active listings</p>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">
                arrow_forward_ios
              </span>
            </button>
          ))}
        </div>
      </section>

    </MobileShell>
  );
};

export default Home;
