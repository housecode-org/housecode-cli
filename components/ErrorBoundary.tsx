import React from "react";
import { CustomErrorPage } from "./CustomErrorPage.js";
import type { NextlyConfig } from "./Nextly.js";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  config: NextlyConfig;
}
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override render() {
    if (this.state.hasError)
      return (
        <CustomErrorPage error={this.state.error} config={this.props.config} />
      );

    return this.props.children;
  }
}

export default ErrorBoundary;
