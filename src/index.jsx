import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import App from './App';
import reportWebVitals from './reportWebVitals';

const IS_DEV = import.meta.env.DEV;

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Erreur inconnue',
    };
  }

  componentDidCatch(error, info) {
    console.error('Root render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (!IS_DEV) {
        return (
          <main
            style={{
              minHeight: '100vh',
              display: 'grid',
              placeItems: 'center',
              background: '#eef2f7',
              color: '#0f172a',
              padding: 24,
            }}
          >
            <section
              style={{
                width: 'min(640px, 100%)',
                border: '1px solid #dbe3ef',
                borderRadius: 16,
                background: '#ffffff',
                padding: 20,
              }}
            >
              <h1 style={{ marginTop: 0 }}>Une erreur est survenue</h1>
              <p>Le rendu de l&apos;application a échoué. Rechargez la page.</p>
              <button type="button" onClick={() => window.location.reload()}>
                Recharger
              </button>
            </section>
          </main>
        );
      }

      return (
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: '#eef2f7',
            color: '#0f172a',
            padding: 24,
          }}
        >
          <section
            style={{
              width: 'min(720px, 100%)',
              border: '1px solid #dbe3ef',
              borderRadius: 16,
              background: '#ffffff',
              padding: 20,
            }}
          >
            <h1 style={{ marginTop: 0 }}>Erreur d&apos;affichage détectée</h1>
            <p>L&apos;application a rencontré une erreur JavaScript empêchant le rendu.</p>
            <p style={{ color: '#b91c1c', fontWeight: 600 }}>
              Détail: {this.state.errorMessage}
            </p>
            <button type="button" onClick={() => window.location.reload()}>
              Recharger la page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
