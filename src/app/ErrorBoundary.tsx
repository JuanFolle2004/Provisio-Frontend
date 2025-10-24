import type { ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Error capturado por ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Algo salió mal 😕</h2>;
    }
    return this.props.children;
  }
}
