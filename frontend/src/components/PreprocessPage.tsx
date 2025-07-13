import React from 'react';
import { useNavigate } from 'react-router-dom';

const PreprocessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Preprocessing</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Preprocessing Tools</h2>
        <p className="text-gray-600 mb-4">
          This section is under development. Future preprocessing features will include:
        </p>
        
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Image denoising and filtering</li>
          <li>Contrast and brightness adjustment</li>
          <li>Image registration and alignment</li>
          <li>Background subtraction</li>
          <li>Image format conversion</li>
        </ul>
        
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

export default PreprocessPage;