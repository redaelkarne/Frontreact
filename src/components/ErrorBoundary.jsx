import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'interface utilisateur de secours
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez enregistrer l'erreur dans un service de journalisation
    console.error("Erreur capturée par ErrorBoundary :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Interface utilisateur de secours
      return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Une erreur est survenue.</h1>
          <p>Veuillez réessayer plus tard.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
