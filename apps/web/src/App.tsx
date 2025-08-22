
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PromptCrud from './prompt';

function App() {
  return (
    <Router>
      <nav style={{ padding: 16, borderBottom: '1px solid #eee', marginBottom: 24 }}>
        <Link to="/" style={{ fontWeight: 'bold', fontSize: 24, textDecoration: 'none', color: '#1976d2' }}>Prompt Studio</Link>
      </nav>
      <Routes>
        <Route path="/" element={<PromptCrud />} />
      </Routes>
    </Router>
  );
}

export default App;
