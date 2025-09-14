import React from 'react';

export default function DesignPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#333' }}>
      <header style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Design System Showcase</h1>
        <p style={{ color: '#666' }}>A new page to replace the previous broken component.</p>
      </header>

      <main>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Placeholder Content</h2>
          <p>This page has been created to resolve a 500 error on this route.</p>
          <p>The original component was causing the application to crash.</p>
          <p>This new component is a simple, stable placeholder.</p>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginTop: '2rem', color: '#999', fontSize: '0.875rem' }}>
        <p>Verification Step: Successful Render</p>
      </footer>
    </div>
  );
}
