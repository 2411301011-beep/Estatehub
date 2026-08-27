import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatArea } from '../../utils/formatters';

const PropertyCard = ({ property }) => {
  const { favorites, toggleFavorite, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isFavorite = favorites.includes(property.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    await toggleFavorite(property.id);
  };

  const imageSrc = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-ambient hover:shadow-ambient-hover border border-surface-container-high transition-all duration-300 flex flex-col">
      {/* Image & Badges Container */}
      <Link to={`/property/${property.id}`} className="relative aspect-[16/9] w-full overflow-hidden block">
        <img
          src={imageSrc}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="bg-primary/80 backdrop-blur-md text-on-primary text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
              {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {property.verified && (
              <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-xs">verified</span>
                Verified
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            aria-label="Save property"
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
          >
            <span className={`material-symbols-outlined text-lg ${isFavorite ? 'fill-current' : ''}`}>
              favorite
            </span>
          </button>
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="font-body font-bold text-lg text-white drop-shadow-md tracking-tight">
            {formatPrice(property.price, property.price_unit)}
          </span>
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/property/${property.id}`} className="block group-hover:text-secondary transition-colors">
            <h3 className="font-display font-semibold text-base text-on-surface line-clamp-1">
              {property.title}
            </h3>
          </Link>
          <p className="text-outline text-xs mt-1 flex items-center gap-1 line-clamp-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {property.location?.address || `${property.location?.city}`}
          </p>
        </div>

        {/* Specs Stats */}
        <div className="mt-4 pt-3 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-outline">bed</span>
            <span className="font-semibold">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-outline">bathtub</span>
            <span className="font-semibold">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-outline">square_foot</span>
            <span className="font-semibold">{formatArea(property.area_sqft)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
