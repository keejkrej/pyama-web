import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ViewPage from './components/ViewPage';
import AnalysisPage from './components/AnalysisPage';
import PreprocessPage from './components/PreprocessPage';
import DocumentationPage from './components/DocumentationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/view" element={<ViewPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/preprocess" element={<PreprocessPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
