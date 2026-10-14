import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '../ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught a render error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-brand-orange ring-8 ring-orange-50/50">
            <AlertTriangle size={32} />
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Something went wrong
          </h1>

          <p className="mb-6 max-w-md text-sm text-gray-600 sm:text-base">
            An unexpected error occurred while rendering this page. You can try
            reloading the section or return to the store.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 text-sm uppercase tracking-wider font-semibold"
            >
              <RefreshCw size={15} />
              <span>Try Again</span>
            </Button>

            <a
              href="/"
              className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
            >
              <Home size={15} />
              <span>Go to Home</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
