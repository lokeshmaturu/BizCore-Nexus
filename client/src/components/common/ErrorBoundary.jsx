import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('💥 [React Error Boundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Application Error
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              A critical rendering issue occurred in this component.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="text-left bg-slate-50 p-4 rounded-xl text-xs text-rose-700 font-mono overflow-auto max-h-36 mb-6 border border-slate-200">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="secondary" size="sm" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={RefreshCw}
                onClick={this.handleReload}
              >
                Reload App
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
