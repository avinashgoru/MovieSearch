import { useEffect } from 'react';

export const useDocumentTitle = (title, suffix = ' — Cinema Archive') => {
  useEffect(() => {
    if (title) {
      document.title = `${title}${suffix}`;
    } else {
      document.title = 'Cinema Archive';
    }
    
    return () => {
      document.title = 'Cinema Archive'; // reset on unmount
    };
  }, [title, suffix]);
};
