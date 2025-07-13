import React from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Documentation</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-2">1. File Selection</h3>
            <p className="text-gray-700">
              Start by selecting your ND2 microscopy file and output directory on the home page. 
              You can browse through directories or use the default paths for quick setup.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">2. Image Viewing</h3>
            <p className="text-gray-700">
              Use the View page to explore your microscopy data. Navigate through different positions, 
              channels, frames, and particles using the control sliders. Enable or disable particles 
              to focus on specific cells of interest.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">3. Analysis Pipeline</h3>
            <p className="text-gray-700">
              The Analysis page provides a complete pipeline for processing your data:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li><strong>Segmentation:</strong> Identify individual cells in brightfield images</li>
              <li><strong>Tracking:</strong> Follow cells across time frames</li>
              <li><strong>ROI Generation:</strong> Create regions of interest around tracked cells</li>
              <li><strong>Data Export:</strong> Export measurements to CSV format</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">4. Channel Configuration</h3>
            <p className="text-gray-700">
              Configure each channel as either Brightfield (for segmentation) or Fluorescent 
              (for intensity measurements). This helps the software understand your experimental setup.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">5. Background Processing</h3>
            <p className="text-gray-700">
              Analysis tasks run in the background, allowing you to continue using the interface. 
              You'll receive notifications when processes complete.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;