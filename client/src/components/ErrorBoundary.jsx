import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 p-6 transition-colors duration-300">
          <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-500 mb-6">
              <AlertOctagon size={36} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              We encountered a rendering or runtime error. Don't worry, your data is safe.
            </p>
            {this.state.error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg p-3 text-xs font-mono text-left w-full mb-6 max-h-32 overflow-auto border border-red-100 dark:border-red-900/30">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform active:scale-95"
            >
              <RefreshCw size={18} />
              Reset Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
