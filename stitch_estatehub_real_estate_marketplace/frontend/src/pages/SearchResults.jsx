import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import PropertyCard from '../components/property/PropertyCard';
import FilterDrawer from '../components/property/FilterDrawer';
import EmptyState from '../components/common/EmptyState';
import { PropertySkeleton } from '../components/common/LoadingSkeleton';
import { getProperties } from '../api/properties';

const PROPERTY_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Plot', value: 'plot' },
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCity = searchParams.get('city') || 'Gurgaon';
  const initialType = searchParams.get('property_type') || '';
  const initialListing = searchParams.get('listing_type') || '';
  const initialQ = searchParams.get('q') || '';
  const initialBeds = searchParams.get('bedrooms') || '';
  const initialMaxPrice = searchParams.get('max_price') || '';

  const [filters, setFilters] = useState({
    city: initialCity,
    property_type: initialType,
    listing_type: initialListing,
    bedrooms: initialBeds,
    max_price: initialMaxPrice,
    q: initialQ,
    sort: 'newest',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      city: searchParams.get('city') || 'Gurgaon',
      property_type: searchParams.get('property_type') || '',
      listing_type: searchParams.get('listing_type') || '',
      q: searchParams.get('q') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      max_price: searchParams.get('max_price') || '',
    }));
  }, [searchParams]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        city: filters.city,
        page,
        limit: 12,
        sort: filters.sort,
      };
      if (filters.property_type) params.property_type = filters.property_type;
      if (filters.listing_type) params.listing_type = filters.listing_type;
      if (filters.bedrooms) params.bedrooms = parseInt(filters.bedrooms);
      if (filters.max_price) params.max_price = parseFloat(filters.max_price);
      if (filters.q) params.q = filters.q;

      const data = await getProperties(params);
      setProperties(data.items || []);
      setTotalCount(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error("Failed to fetch search properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters.city, filters.property_type, filters.listing_type, filters.bedrooms, filters.max_price, filters.q, filters.sort, page]);

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    setPage(1);
    const newParams = new URLSearchParams();
    if (filters.city) newParams.set('city', filters.city);
    if (filters.property_type) newParams.set('property_type', filters.property_type);
    if (filters.listing_type) newParams.set('listing_type', filters.listing_type);
    if (filters.bedrooms) newParams.set('bedrooms', filters.bedrooms);
    if (filters.max_price) newParams.set('max_price', filters.max_price);
    if (filters.q) newParams.set('q', filters.q);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      city: 'Gurgaon',
      property_type: '',
      listing_type: '',
      bedrooms: '',
      max_price: '',
      q: '',
      sort: 'newest',
    };
    setFilters(defaultFilters);
    setIsFilterOpen(false);
    setPage(1);
    setSearchParams({ city: 'Gurgaon' });
  };

  const activeFilterCount = [
    filters.property_type,
    filters.listing_type,
    filters.bedrooms,
    filters.max_price,
    filters.q,
  ].filter(Boolean).length;

  return (
    <MobileShell activeCity={filters.city} onCityChange={(c) => setFilters({ ...filters, city: c })}>
      
      {/* Search Bar Header */}
      <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-surface-container-high shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 bg-surface-container-low px-4 py-2.5 rounded-xl flex items-center gap-3 border border-outline-variant/40 w-full">
            <span className="material-symbols-outlined text-outline text-xl">search</span>
            <input
              type="text"
              placeholder={`Search by location, project or keyword in ${filters.city}...`}
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full bg-transparent text-sm text-on-surface font-medium placeholder-outline focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-between">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`lg:hidden px-4 py-2.5 rounded-xl border flex items-center justify-center gap-2 relative transition-colors ${
                activeFilterCount > 0
                  ? 'bg-secondary text-on-secondary border-secondary shadow-sm font-bold text-xs'
                  : 'bg-surface-container-low text-on-surface border-outline-variant/40 text-xs font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="bg-surface-container-low text-on-surface border border-outline-variant/40 text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between text-xs">
          <h1 className="font-display font-semibold text-base text-on-surface">
            <span className="text-secondary font-bold">{totalCount}</span> Properties in {filters.city}
          </h1>
        </div>
      </div>

      {/* Main Content Area (Desktop Sidebar + Grid) */}
      <div className="flex items-start gap-8">
        
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-surface-container-high mb-4">
            <h3 className="font-display font-bold text-base text-on-surface">Filters</h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-secondary font-bold hover:underline"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-5">
            {/* Listing Type */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Listing Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['', 'sale', 'rent'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilters({ ...filters, listing_type: t })}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      filters.listing_type === t
                        ? 'bg-secondary text-on-secondary border-secondary'
                        : 'bg-surface-container-low text-outline border-transparent hover:text-on-surface'
                    }`}
                  >
                    {t === '' ? 'All' : t === 'sale' ? 'For Sale' : 'For Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Property Type</label>
              <select
                value={filters.property_type}
                onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
                className="w-full bg-surface-container-low text-on-surface border border-surface-container-high px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-secondary"
              >
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>{pt.label}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Bedrooms</label>
              <div className="flex items-center gap-1.5">
                {['', '1', '2', '3', '4'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setFilters({ ...filters, bedrooms: b })}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      filters.bedrooms === b
                        ? 'bg-secondary text-on-secondary border-secondary'
                        : 'bg-surface-container-low text-outline border-transparent hover:text-on-surface'
                    }`}
                  >
                    {b === '' ? 'Any' : `${b}+`}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyFilters}
              className="w-full py-2.5 bg-secondary text-on-secondary font-bold text-xs rounded-xl shadow-sm hover:bg-secondary/90 transition-all"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1 w-full space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <PropertySkeleton />
              <PropertySkeleton />
              <PropertySkeleton />
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              icon="home_work"
              title="No properties found"
              description={`We couldn't find any properties matching your search criteria in ${filters.city}.`}
              actionText="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-surface-container-high text-xs">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-xl border border-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container text-on-surface font-bold"
                  >
                    ← Previous Page
                  </button>
                  <span className="text-outline font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-xl border border-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container text-on-surface font-bold"
                  >
                    Next Page →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

    </MobileShell>
  );
};

export default SearchResults;
