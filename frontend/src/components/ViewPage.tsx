import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getView, updateImage, updateParticleEnabled } from '../services/api';
import type { ViewResponse, ImageResponse, ImageUpdate, ParticleEnabledUpdate } from '../services/api';

const ViewPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewData, setViewData] = useState<ViewResponse | null>(null);
  const [position, setPosition] = useState(0);
  const [channel, setChannel] = useState(0);
  const [frame, setFrame] = useState(0);
  const [particle, setParticle] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadViewData();
  }, []);

  const loadViewData = async () => {
    try {
      const response = await getView();
      setViewData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading view data:', error);
      navigate('/');
    }
  };

  const handleImageUpdate = async () => {
    if (!viewData) return;

    const updateData: ImageUpdate = {
      position,
      channel,
      frame,
      particle
    };

    try {
      const response = await updateImage(updateData);
      const imageData: ImageResponse = response.data;
      
      setViewData(prev => prev ? {
        ...prev,
        channel_image: imageData.channel_image,
        brightness_plot: imageData.brightness_plot,
        all_particles_len: imageData.all_particles_len,
        disabled_particles: imageData.disabled_particles
      } : null);
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const handleParticleEnabledChange = async (enabled: boolean) => {
    const updateData: ParticleEnabledUpdate = { enabled };

    try {
      const response = await updateParticleEnabled(updateData);
      const imageData: ImageResponse = response.data;
      
      setViewData(prev => prev ? {
        ...prev,
        channel_image: imageData.channel_image,
        brightness_plot: imageData.brightness_plot,
        all_particles_len: imageData.all_particles_len,
        disabled_particles: imageData.disabled_particles
      } : null);
    } catch (error) {
      console.error('Error updating particle enabled:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!viewData) {
    return <div className="flex justify-center items-center h-screen">No data available</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar Controls */}
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Image Controls</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Position (0-{viewData.n_positions - 1})</label>
          <input
            type="range"
            min="0"
            max={viewData.n_positions - 1}
            value={position}
            onChange={(e) => setPosition(parseInt(e.target.value))}
            onMouseUp={handleImageUpdate}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{position}</span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Channel (0-{viewData.n_channels})</label>
          <input
            type="range"
            min="0"
            max={viewData.n_channels}
            value={channel}
            onChange={(e) => setChannel(parseInt(e.target.value))}
            onMouseUp={handleImageUpdate}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{channel}</span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Frame (0-{viewData.n_frames})</label>
          <input
            type="range"
            min="0"
            max={viewData.n_frames}
            value={frame}
            onChange={(e) => setFrame(parseInt(e.target.value))}
            onMouseUp={handleImageUpdate}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{frame}</span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Particle (0-{viewData.all_particles_len - 1})</label>
          <input
            type="range"
            min="0"
            max={viewData.all_particles_len - 1}
            value={particle}
            onChange={(e) => setParticle(parseInt(e.target.value))}
            onMouseUp={handleImageUpdate}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{particle}</span>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              onChange={(e) => handleParticleEnabledChange(e.target.checked)}
              className="mr-2"
            />
            Enable Particle
          </label>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Current Particle: {viewData.current_particle_index}</h3>
          <p className="text-sm text-gray-600">Total Particles: {viewData.all_particles_len}</p>
          <p className="text-sm text-gray-600">Disabled: {viewData.disabled_particles.length}</p>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>

      {/* Main Image Display */}
      <div className="flex-1 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Image Viewer</h1>
          
          {/* Channel Image */}
          <div className="mb-4">
            <img 
              src={`data:image/png;base64,${viewData.channel_image}`}
              alt="Channel Image"
              className="max-w-full max-h-96 mx-auto"
            />
          </div>

          {/* Brightness Plot */}
          <div>
            <h3 className="text-lg font-medium mb-2">Brightness Plot</h3>
            <img 
              src={`data:image/png;base64,${viewData.brightness_plot}`}
              alt="Brightness Plot"
              className="max-w-full max-h-64 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;