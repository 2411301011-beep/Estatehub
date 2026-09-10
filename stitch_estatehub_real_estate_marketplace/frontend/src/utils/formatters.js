export const formatPrice = (price, priceUnit = 'total') => {
  if (!price && price !== 0) return 'Price on Request';
  
  let formatted = '';
  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2).replace(/\.00$/, '');
    formatted = `₹${cr} Cr`;
  } else if (price >= 100000) {
    const lakh = (price / 100000).toFixed(2).replace(/\.00$/, '');
    formatted = `₹${lakh} Lakhs`;
  } else {
    formatted = `₹${price.toLocaleString('en-IN')}`;
  }

  if (priceUnit === 'per_month') {
    return `${formatted}/mo`;
  }
  return formatted;
};

export const formatArea = (sqft) => {
  if (!sqft) return '';
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
};
