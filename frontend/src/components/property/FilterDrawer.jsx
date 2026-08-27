import React from 'react';

const FilterDrawer = ({ isOpen, onClose, filters, setFilters, onApply, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
      <div className="bg-surface-container-lowest w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">tune</span>
            <h2 className="font-display font-semibold text-lg text-on-surface">Filter Listings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 no-scrollbar">
          
          {/* Listing Type (Buy / Rent) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-2">
              Listing Purpose
            </label>
            <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-1 rounded-xl">
              {[
                { label: 'All', value: '' },
                { label: 'Buy', value: 'buy' },
                { label: 'Rent', value: 'rent' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilters({ ...filters, listing_type: opt.value })}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    filters.listing_type === opt.value
                      ? 'bg-surface-container-lowest text-secondary shadow-sm'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-2">
              Property Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Apartment', value: 'apartment', icon: 'apartment' },
                { label: 'Villa', value: 'villa', icon: 'villa' },
                { label: 'Commercial', value: 'commercial', icon: 'storefront' },
              ].map((type) => {
                const isSelected = filters.property_type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        property_type: isSelected ? '' : type.value,
                      })
                    }
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-secondary bg-secondary-container/20 text-secondary shadow-sm font-semibold'
                        : 'border-surface-container-high text-on-surface-variant hover:border-outline-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{type.icon}</span>
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* City Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-2">
              City / Region
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Gurgaon', 'Delhi', 'Noida', 'Mumbai'].map((c) => {
                const isSelected = filters.city === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilters({ ...filters, city: c })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-secondary bg-secondary-container/20 text-secondary font-semibold'
                        : 'border-surface-container-high text-on-surface-variant hover:border-outline-variant'
                    }`}
                  >
                    <span>📍 {c}</span>
                    {isSelected && <span className="material-symbols-outlined text-base">check</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-2">
              Bedrooms
            </label>
            <div className="flex items-center gap-2">
              {['', '1', '2', '3', '4'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFilters({ ...filters, bedrooms: b })}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    filters.bedrooms === b
                      ? 'border-secondary bg-secondary text-on-secondary shadow-sm'
                      : 'border-surface-container-high text-on-surface-variant hover:border-outline-variant'
                  }`}
                >
                  {b === '' ? 'Any' : b === '4' ? '4+ Beds' : `${b} Bed`}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider / Inputs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-2">
              Max Budget (₹)
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="1000000"
                max="200000000"
                step="5000000"
                value={filters.max_price || 200000000}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                className="w-full accent-secondary cursor-pointer"
              />
              <div className="flex justify-between text-xs font-semibold text-on-surface">
                <span>₹10 Lakhs</span>
                <span className="text-secondary font-bold">
                  {filters.max_price >= 10000000
                    ? `Up to ₹${(filters.max_price / 10000000).toFixed(1)} Cr`
                    : `Up to ₹${(filters.max_price / 100000).toFixed(0)} Lakhs`}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-surface-container-high flex items-center gap-3 bg-surface-container-low">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-3 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-[2] py-3 bg-secondary text-on-secondary rounded-xl text-xs font-bold shadow-md hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">search</span>
            Show Properties
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterDrawer;
