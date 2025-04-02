// PreferencesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
      const { accBST } = useAuth();

    const [preferences, setPreferences] = useState({
        theme: accBST?.theme || 'Light',
        language: accBST?.language || 'en',
    });

    useEffect(() => {
        // If the theme is saved in accBST, update the document attribute
        if (accBST && accBST.theme) {
        document.documentElement.setAttribute('data-theme', accBST.theme.toLowerCase());
        setPreferences(prev => ({ ...prev, theme: accBST.theme }));
        }
    }, [accBST]);

    return (
        <PreferencesContext.Provider value={{ preferences, setPreferences }}>
        {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => useContext(PreferencesContext);
