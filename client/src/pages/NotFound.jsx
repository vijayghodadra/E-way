import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <>
      <SEO title="Page Not Found (404)" />

      <div className="min-h-[70vh] flex items-center justify-center text-center px-4 py-16">
        <div className="max-w-md space-y-4">
          <span className="font-serif-luxury font-bold text-6xl text-primary">404</span>
          <h1 className="font-playfair text-2xl font-bold text-text">Page Not Found</h1>
          <p className="text-xs text-muted font-light">
            The botanical remedy or page you are looking for has been moved or does not exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-6 py-3.5 rounded-2xl hover:bg-primary-dark transition-all"
          >
            Return To Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
