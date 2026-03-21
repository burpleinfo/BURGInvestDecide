import React, { createContext, useState, useCallback } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [isHomeSearchVisible, setIsHomeSearchVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const updateHomeSearchVisibility = useCallback((visible) => {
    setIsHomeSearchVisible(visible);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isHomeSearchVisible,
        updateHomeSearchVisibility,
        searchQuery,
        updateSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
