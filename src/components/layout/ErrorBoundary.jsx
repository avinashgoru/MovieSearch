import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col min-h-screen bg-background text-primary items-center justify-center p-8 text-center">
          <p className="font-mono text-sm text-accent uppercase tracking-widest mb-4">Transmission Error</p>
          <h1 className="font-display text-4xl mb-4">The archive encountered an unexpected problem.</h1>
          <p className="font-sans text-secondary mb-8 max-w-md">
            Something went wrong while rendering the application. We've noted the issue.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-surface-elevated text-primary border border-border rounded-sm hover:border-secondary transition-all"
          >
            Reload Archive
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
