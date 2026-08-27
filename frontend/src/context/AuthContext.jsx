import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/auth';
import { addFavorite as addFavApi, removeFavorite as removeFavApi } from '../api/favorites';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('estatehub_token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setFavorites(userData.saved_properties || []);
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem('estatehub_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    localStorage.setItem('estatehub_token', res.access_token);
    setUser(res.user);
    setFavorites(res.user.saved_properties || []);
    return res.user;
  };

  const register = async (name, email, password, phone) => {
    const res = await registerUser(name, email, password, phone);
    localStorage.setItem('estatehub_token', res.access_token);
    setUser(res.user);
    setFavorites(res.user.saved_properties || []);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('estatehub_token');
    setUser(null);
    setFavorites([]);
  };

  const toggleFavorite = async (propertyId) => {
    if (!user) {
      return false; // Indicating unauthenticated, caller should redirect to login
    }

    const isFav = favorites.includes(propertyId);
    // Optimistic update
    const updatedFavs = isFav
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];

    setFavorites(updatedFavs);

    try {
      if (isFav) {
        await removeFavApi(propertyId);
      } else {
        await addFavApi(propertyId);
      }
      return true;
    } catch (err) {
      console.error("Failed to update favorite:", err);
      // Rollback
      setFavorites(favorites);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        favorites,
        loading,
        login,
        register,
        logout,
        toggleFavorite,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
