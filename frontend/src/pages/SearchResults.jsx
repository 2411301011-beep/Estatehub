import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import PropertyCard from '../components/property/PropertyCard';
import FilterDrawer from '../components/property/FilterDrawer';
import EmptyState from '../components/common/EmptyState';
import { PropertySkeleton } from '../components/common/LoadingSkeleton';
import { getProperties } from '../api/properties';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL query params
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

  // Sync state with URL params change
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

  // Fetch properties from backend
  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        city: filters.city,
        page,
        limit: 10,
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
    // Update URL query string
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
      
      {/* Search Header Bar */}
      <div className="bg-surface-container-lowest p-4 sticky top-[57px] z-30 border-b border-surface-container-high shadow-sm">
        
        {/* Search input & Filter Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-surface-container-low px-3 py-2 rounded-xl flex items-center gap-2 border border-outline-variant/40">
            <span className="material-symbols-outlined text-outline text-lg">search</span>
            <input
              type="text"
              placeholder={`Search in ${filters.city}...`}
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full bg-transparent text-xs text-on-surface font-medium placeholder-outline focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className={`p-2.5 rounded-xl border flex items-center justify-center relative transition-colors ${
              activeFilterCount > 0
                ? 'bg-secondary text-on-secondary border-secondary shadow-sm'
                : 'bg-surface-container-low text-on-surface border-outline-variant/40 hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-xl">tune</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Results Count Banner */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <h1 className="font-display font-semibold text-sm text-on-surface">
            <span className="text-secondary font-bold">{totalCount}</span> Properties found in {filters.city}
          </h1>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="bg-transparent text-outline hover:text-on-surface font-medium text-xs focus:outline-none cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Content */}
      <div className="p-4 space-y-4">
        {loading ? (
          <>
            <PropertySkeleton />
            <PropertySkeleton />
            <PropertySkeleton />
          </>
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
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-surface-container-high text-xs">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 rounded-lg border border-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container text-on-surface font-semibold"
                >
                  ← Previous
                </button>
                <span className="text-outline font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 rounded-lg border border-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container text-on-surface font-semibold"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Drawer */}
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
