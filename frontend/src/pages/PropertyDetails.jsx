import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import AgentContactCard from '../components/agent/AgentContactCard';
import { getPropertyById } from '../api/properties';
import { submitInquiry } from '../api/inquiries';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatArea } from '../utils/formatters';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favorites, toggleFavorite, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Inquiry Modal State
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: 'Hello, I am interested in this listing. Please get back to me with more details.',
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Error loading property:", err);
        setError("Property not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (user) {
      setInquiryData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <MobileShell hideHeader>
        <div className="p-4 space-y-4 animate-pulse">
          <div className="h-64 bg-surface-container-high rounded-2xl w-full" />
          <div className="h-6 bg-surface-container-high rounded w-3/4" />
          <div className="h-4 bg-surface-container-low rounded w-1/2" />
        </div>
      </MobileShell>
    );
  }

  if (error || !property) {
    return (
      <MobileShell hideHeader>
        <div className="p-8 text-center">
          <h2 className="font-display font-bold text-lg text-on-surface">Property Not Found</h2>
          <p className="text-outline text-xs mt-2">{error}</p>

          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-secondary text-on-secondary text-xs font-bold rounded-xl"
          >
            Return to Home
          </button>
        </div>
      </MobileShell>
    );
  }

  const isFav = favorites.includes(property.id);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/property/${property.id}` } });
      return;
    }
    await toggleFavorite(property.id);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquiryError('');
    try {
      await submitInquiry({
        property_id: property.id,
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        message: inquiryData.message,
      });
      setInquirySuccess(true);
    } catch (err) {
      setInquiryError(err.response?.data?.detail || "Failed to submit inquiry. Please try again.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  return (
    <MobileShell hideHeader>
      
      {/* Top Floating Actions & Gallery Header */}
      <div className="relative w-full aspect-[4/3] bg-black">
        <img
          src={images[activeImgIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Floating Top Nav */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <button
            onClick={handleFavoriteToggle}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
              isFav ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${isFav ? 'fill-current' : ''}`}>
              favorite
            </span>
          </button>
        </div>

        {/* Gallery Image Counter & Selectors */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {activeImgIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Gallery Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 p-2 px-4 bg-surface-container-low overflow-x-auto no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImgIndex(idx)}
              className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                activeImgIndex === idx ? 'border-secondary scale-95' : 'border-transparent opacity-70'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Details Body */}
      <div className="p-5 space-y-6">
        
        {/* Title, Badges & Price */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-primary text-on-primary text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full">
              {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {property.verified && (
              <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                Verified Listing
              </span>
            )}
          </div>

          <h1 className="font-display font-bold text-xl text-on-surface leading-tight mt-1">
            {property.title}
          </h1>

          <p className="text-outline text-xs mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {property.location?.address}, {property.location?.city}
          </p>

          <div className="mt-3 pt-3 border-t border-surface-container-high flex items-baseline justify-between">
            <div>
              <span className="text-xs text-outline block">Price</span>
              <span className="font-body font-bold text-2xl text-secondary tracking-tight">
                {formatPrice(property.price, property.price_unit)}
              </span>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container-high">
              {property.property_type?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-3 bg-surface-container-low p-3.5 rounded-2xl border border-surface-container-high text-center">
          <div>
            <span className="material-symbols-outlined text-secondary text-xl block mb-0.5">bed</span>
            <span className="font-semibold text-xs text-on-surface block">{property.bedrooms} Bedrooms</span>
          </div>
          <div>
            <span className="material-symbols-outlined text-secondary text-xl block mb-0.5">bathtub</span>
            <span className="font-semibold text-xs text-on-surface block">{property.bathrooms} Bathrooms</span>
          </div>
          <div>
            <span className="material-symbols-outlined text-secondary text-xl block mb-0.5">square_foot</span>
            <span className="font-semibold text-xs text-on-surface block">{formatArea(property.area_sqft)}</span>
          </div>
        </div>

        {/* Overview Description */}
        <div>
          <h3 className="font-display font-semibold text-base text-on-surface mb-2">Overview</h3>
          <p className="text-on-surface-variant text-xs leading-relaxed whitespace-pre-line">
            {property.description}
          </p>
        </div>

        {/* Amenities Grid */}
        {property.amenities && property.amenities.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-base text-on-surface mb-3">Key Amenities</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {property.amenities.map((am) => (
                <div
                  key={am}
                  className="bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container-high flex items-center gap-2 text-xs font-medium text-on-surface"
                >
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listed By Agent Card */}
        <AgentContactCard
          agent={property.agent}
          onInquireClick={() => setIsInquiryModalOpen(true)}
        />

      </div>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 overflow-hidden">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container-high">
              <h3 className="font-display font-semibold text-base text-on-surface">Inquire About Listing</h3>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {inquirySuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">check</span>
                </div>
                <h4 className="font-display font-bold text-base text-on-surface">Inquiry Sent!</h4>
                <p className="text-outline text-xs max-w-xs mx-auto">
                  Thank you! The agent has received your request and will contact you shortly.
                </p>
                <button
                  onClick={() => {
                    setIsInquiryModalOpen(false);
                    setInquirySuccess(false);
                  }}
                  className="mt-4 px-6 py-2.5 bg-secondary text-on-secondary rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                {inquiryError && (
                  <div className="p-2.5 bg-error-container text-on-error-container rounded-xl text-xs">
                    {inquiryError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-container-high px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-container-high px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-container-high px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-container-high px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="w-full py-3 bg-secondary text-on-secondary rounded-xl text-xs font-bold shadow-md hover:bg-secondary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {inquirySubmitting ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </MobileShell>
  );
};

export default PropertyDetails;
