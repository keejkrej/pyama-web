import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAnalysis, 
  doSegmentation, 
  doTracking, 
  doSquareROIs, 
  doExport
} from '../services/api';
import type {
  AnalysisResponse,
  SegmentationRequest,
  TrackingRequest,
  SquareROIRequest,
  ExportRequest
} from '../services/api';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [positionMin, setPositionMin] = useState(0);
  const [positionMax, setPositionMax] = useState(0);
  const [frameMin, setFrameMin] = useState(0);
  const [frameMax, setFrameMax] = useState(0);
  const [channelTypes, setChannelTypes] = useState<{[key: number]: string}>({});
  const [expandLabels, setExpandLabels] = useState(false);
  const [squareSize, setSquareSize] = useState(10);
  const [minutes, setMinutes] = useState(5);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    try {
      const response = await getAnalysis();
      const data = response.data;
      setAnalysisData(data);
      setPositionMax(data.n_positions - 1);
      setFrameMax(data.n_frames);
      
      // Initialize channel types
      const initialChannelTypes: {[key: number]: string} = {};
      for (let i = 0; i <= data.n_channels; i++) {
        initialChannelTypes[i] = 'None';
      }
      setChannelTypes(initialChannelTypes);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading analysis data:', error);
      navigate('/');
    }
  };

  const handleSegmentation = async () => {
    if (!analysisData) return;

    const request: SegmentationRequest = {
      position_min: positionMin,
      position_max: positionMax,
      frame_min: frameMin,
      frame_max: frameMax,
      channel_0: channelTypes[0] || 'None',
      channel_1: channelTypes[1],
      channel_2: channelTypes[2],
      channel_3: channelTypes[3],
      channel_4: channelTypes[4],
    };

    try {
      const response = await doSegmentation(request);
      alert(`Segmentation ${response.data.status}: ${response.data.message}`);
    } catch (error) {
      console.error('Error starting segmentation:', error);
      alert('Error starting segmentation');
    }
  };

  const handleTracking = async () => {
    const request: TrackingRequest = {
      position_min: positionMin,
      position_max: positionMax,
      expand_labels: expandLabels
    };

    try {
      const response = await doTracking(request);
      alert(`Tracking ${response.data.status}: ${response.data.message}`);
    } catch (error) {
      console.error('Error starting tracking:', error);
      alert('Error starting tracking');
    }
  };

  const handleSquareROIs = async () => {
    const request: SquareROIRequest = {
      position_min: positionMin,
      position_max: positionMax,
      square_size: squareSize
    };

    try {
      const response = await doSquareROIs(request);
      alert(`Square ROI ${response.data.status}: ${response.data.message}`);
    } catch (error) {
      console.error('Error starting square ROI generation:', error);
      alert('Error starting square ROI generation');
    }
  };

  const handleExport = async () => {
    const request: ExportRequest = {
      position_min: positionMin,
      position_max: positionMax,
      minutes: minutes
    };

    try {
      const response = await doExport(request);
      alert(`Export ${response.data.status}: ${response.data.message}`);
    } catch (error) {
      console.error('Error starting export:', error);
      alert('Error starting export');
    }
  };

  const handleChannelTypeChange = (channel: number, type: string) => {
    setChannelTypes(prev => ({
      ...prev,
      [channel]: type
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!analysisData) {
    return <div className="flex justify-center items-center h-screen">No data available</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Analysis Pipeline</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position and Frame Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Range Settings</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Position Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max={analysisData.n_positions - 1}
                value={positionMin}
                onChange={(e) => setPositionMin(parseInt(e.target.value))}
                className="flex-1 p-2 border rounded"
                placeholder="Min"
              />
              <span className="self-center">to</span>
              <input
                type="number"
                min="0"
                max={analysisData.n_positions - 1}
                value={positionMax}
                onChange={(e) => setPositionMax(parseInt(e.target.value))}
                className="flex-1 p-2 border rounded"
                placeholder="Max"
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Available: 0 to {analysisData.n_positions - 1}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Frame Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max={analysisData.n_frames}
                value={frameMin}
                onChange={(e) => setFrameMin(parseInt(e.target.value))}
                className="flex-1 p-2 border rounded"
                placeholder="Min"
              />
              <span className="self-center">to</span>
              <input
                type="number"
                min="0"
                max={analysisData.n_frames}
                value={frameMax}
                onChange={(e) => setFrameMax(parseInt(e.target.value))}
                className="flex-1 p-2 border rounded"
                placeholder="Max"
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Available: 0 to {analysisData.n_frames}</p>
          </div>
        </div>

        {/* Channel Configuration */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Channel Configuration</h2>
          
          {Array.from({ length: analysisData.n_channels + 1 }, (_, i) => (
            <div key={i} className="mb-3">
              <label className="block text-sm font-medium mb-1">Channel {i}</label>
              <select
                value={channelTypes[i] || 'None'}
                onChange={(e) => handleChannelTypeChange(i, e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="None">None</option>
                <option value="Brightfield">Brightfield</option>
                <option value="Fluorescent">Fluorescent</option>
              </select>
            </div>
          ))}
        </div>

        {/* Segmentation */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Segmentation</h2>
          <p className="text-sm text-gray-600 mb-4">
            Segment cells in brightfield channels to identify individual cells.
          </p>
          <button
            onClick={handleSegmentation}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Start Segmentation
          </button>
        </div>

        {/* Tracking */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tracking</h2>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={expandLabels}
                onChange={(e) => setExpandLabels(e.target.checked)}
                className="mr-2"
              />
              Expand Labels
            </label>
          </div>
          <button
            onClick={handleTracking}
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
          >
            Start Tracking
          </button>
        </div>

        {/* Square ROIs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Square ROIs</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Square Size (μm)</label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={squareSize}
              onChange={(e) => setSquareSize(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleSquareROIs}
            className="w-full bg-purple-500 text-white p-3 rounded hover:bg-purple-600"
          >
            Generate Square ROIs
          </button>
        </div>

        {/* Export */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Export Data</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Time Interval (minutes)</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={minutes}
              onChange={(e) => setMinutes(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleExport}
            className="w-full bg-orange-500 text-white p-3 rounded hover:bg-orange-600"
          >
            Export to CSV
          </button>
        </div>
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
  );
};

export default AnalysisPage;