import React from "react";
import { CustomErrorPage } from "./CustomErrorPage.js";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override render() {
    if (this.state.hasError)
      return <CustomErrorPage error={this.state.error} />;

    return this.props.children;
  }
}

export default ErrorBoundary;
