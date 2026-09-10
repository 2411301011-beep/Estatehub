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

  // Inquiry Form State
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
      <MobileShell>
        <div className="p-4 space-y-4 animate-pulse">
          <div className="h-96 bg-surface-container-high rounded-2xl w-full" />
          <div className="h-6 bg-surface-container-high rounded w-3/4" />
          <div className="h-4 bg-surface-container-low rounded w-1/2" />
        </div>
      </MobileShell>
    );
  }

  if (error || !property) {
    return (
      <MobileShell>
        <div className="p-12 text-center">
          <h2 className="font-display font-bold text-xl text-on-surface">Property Not Found</h2>
          <p className="text-outline text-xs mt-2">{error}</p>

          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2.5 bg-secondary text-on-secondary text-xs font-bold rounded-xl"
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
    <MobileShell activeCity={property.location?.city}>
      
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-bold text-outline hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Back to Listings</span>
        </button>

        <button
          onClick={handleFavoriteToggle}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
            isFav
              ? 'bg-rose-500 text-white border-rose-500'
              : 'bg-surface-container-low text-on-surface border-surface-container-high hover:bg-surface-container'
          }`}
        >
          <span className={`material-symbols-outlined text-base ${isFav ? 'fill-current' : ''}`}>
            favorite
          </span>
          <span>{isFav ? 'Saved' : 'Save Property'}</span>
        </button>
      </div>

      {/* Main Grid Layout (Left Media & Info, Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Images, Title, Specs, Overview, Amenities) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative w-full h-[320px] sm:h-[420px] bg-black rounded-3xl overflow-hidden shadow-lg">
              <img
                src={images[activeImgIndex]}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                {activeImgIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImgIndex === idx ? 'border-secondary scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Badges */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-on-primary text-xs font-semibold uppercase px-3 py-1 rounded-full">
                {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {property.verified && (
                <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Verified Listing
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface leading-tight">
              {property.title}
            </h1>

            <p className="text-outline text-xs sm:text-sm flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-secondary text-lg">location_on</span>
              {property.location?.address}, {property.location?.city}
            </p>

            <div className="pt-4 border-t border-surface-container-high flex items-baseline justify-between">
              <div>
                <span className="text-xs text-outline block">Price</span>
                <span className="font-body font-bold text-3xl text-secondary tracking-tight">
                  {formatPrice(property.price, property.price_unit)}
                </span>
              </div>
              <span className="text-xs font-bold text-on-surface bg-surface-container-low px-4 py-2 rounded-xl border border-surface-container-high">
                {property.property_type?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-4 bg-surface-container-lowest p-5 rounded-3xl border border-surface-container-high shadow-sm text-center">
            <div>
              <span className="material-symbols-outlined text-secondary text-2xl block mb-1">bed</span>
              <span className="font-bold text-sm text-on-surface block">{property.bedrooms} Bedrooms</span>
            </div>
            <div>
              <span className="material-symbols-outlined text-secondary text-2xl block mb-1">bathtub</span>
              <span className="font-bold text-sm text-on-surface block">{property.bathrooms} Bathrooms</span>
            </div>
            <div>
              <span className="material-symbols-outlined text-secondary text-2xl block mb-1">square_foot</span>
              <span className="font-bold text-sm text-on-surface block">{formatArea(property.area_sqft)}</span>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-sm">
            <h3 className="font-display font-bold text-lg text-on-surface mb-3">Overview</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-sm">
              <h3 className="font-display font-bold text-lg text-on-surface mb-4">Key Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((am) => (
                  <div
                    key={am}
                    className="bg-surface-container-low p-3 rounded-2xl border border-surface-container-high flex items-center gap-2.5 text-xs font-semibold text-on-surface"
                  >
                    <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column Sticky Sidebar (Agent Info & Inquiry Form) */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-lg space-y-6">
            
            {/* Agent Contact Card Header */}
            <h3 className="font-display font-bold text-lg text-on-surface pb-3 border-b border-surface-container-high">
              Contact Listing Agent
            </h3>

            <AgentContactCard
              agent={property.agent}
              onInquireClick={() => {}}
            />

            {/* Inquiry Form */}
            <div className="pt-2">
              <h4 className="font-display font-semibold text-sm text-on-surface mb-3">Send Inquiry</h4>

              {inquirySuccess ? (
                <div className="py-6 text-center space-y-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-xl">check</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-emerald-900">Inquiry Sent!</h4>
                  <p className="text-emerald-700 text-xs">
                    The agent has received your details and will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  {inquiryError && (
                    <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs">
                      {inquiryError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-outline mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                      className="w-full bg-surface-container-low border border-surface-container-high px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-outline mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                      className="w-full bg-surface-container-low border border-surface-container-high px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-outline mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                      className="w-full bg-surface-container-low border border-surface-container-high px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-outline mb-1">Message</label>
                    <textarea
                      rows={3}
                      required
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                      className="w-full bg-surface-container-low border border-surface-container-high px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="w-full py-3 bg-secondary text-on-secondary rounded-xl text-xs font-bold shadow-md hover:bg-secondary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {inquirySubmitting ? 'Sending...' : 'Send Inquiry to Agent'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>

    </MobileShell>
  );
};

export default PropertyDetails;
