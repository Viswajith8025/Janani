import React from 'react';
import { Leaf, AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-elegant mb-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="font-serif text-3xl text-forest-900 mb-4">Something went wrong</h1>
          <p className="text-forest-600 mb-8 max-w-md mx-auto">
            We apologize, but there was a problem rendering this page. Please try refreshing.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-forest-800 text-white rounded-full font-medium text-sm hover:bg-forest-900 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
