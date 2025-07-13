import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectPaths, listDirectory, getHomeDirectory } from '../services/api';
import type { PathSelection, DirectoryResponse } from '../services/api';

interface DirectoryItem {
  name: string;
  isDirectory: boolean;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [nd2CurrentPath, setNd2CurrentPath] = useState('');
  const [outCurrentPath, setOutCurrentPath] = useState('');
  const [nd2Files, setNd2Files] = useState<DirectoryItem[]>([]);
  const [outFiles, setOutFiles] = useState<DirectoryItem[]>([]);
  const [nd2SelectedItem, setNd2SelectedItem] = useState('');
  const [outSelectedItem, setOutSelectedItem] = useState('');

  useEffect(() => {
    const initializeDirectories = async () => {
      try {
        // Get home directory first, then load its contents
        const homeResponse = await getHomeDirectory();
        const homePath = homeResponse.data.path;
        console.log('Home directory:', homePath);
        
        setNd2CurrentPath(homePath);
        setOutCurrentPath(homePath);
        
        await Promise.all([
          loadDirectory(homePath, 'nd2'),
          loadDirectory(homePath, 'out')
        ]);
      } catch (error) {
        console.error('Error loading home directory, falling back to root:', error);
        setNd2CurrentPath('/');
        setOutCurrentPath('/');
        await Promise.all([
          loadDirectory('/', 'nd2'),
          loadDirectory('/', 'out')
        ]);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeDirectories();
  }, []);

  const loadDirectory = async (path: string, type: 'nd2' | 'out') => {
    try {
      const response = await listDirectory(path);
      const data: DirectoryResponse = response.data;
      
      if (type === 'nd2') {
        setNd2Files(data.items);
        setNd2CurrentPath(data.path);
      } else {
        setOutFiles(data.items);
        setOutCurrentPath(data.path);
      }
    } catch (error) {
      console.error('Error loading directory:', error);
    }
  };

  const goUpDirectory = (type: 'nd2' | 'out') => {
    const currentPath = type === 'nd2' ? nd2CurrentPath : outCurrentPath;
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    loadDirectory(parentPath, type);
  };

  const handleItemClick = (item: DirectoryItem, type: 'nd2' | 'out') => {
    const currentPath = type === 'nd2' ? nd2CurrentPath : outCurrentPath;
    const newPath = `${currentPath}/${item.name}`.replace('//', '/');
    
    if (item.isDirectory) {
      loadDirectory(newPath, type);
    } else {
      if (type === 'nd2') {
        setNd2SelectedItem(newPath);
      } else {
        setOutSelectedItem(newPath);
      }
    }
  };

  const setDefaultPaths = (type: 'local' | 'remote') => {
    if (type === 'local') {
      setNd2CurrentPath('/Volumes//ag-moonraedler/Gerlinde/Schaufel/für Jose/test_mRNATrafo_HuH7A549.nd2');
      setOutCurrentPath('/Volumes/ag-moonraedler/projects/Liscator/analysed_output_folders/test_mRNATrafo_HuH7A549/');
    } else if (type === 'remote') {
      setNd2CurrentPath('/project/ag-moonraedler/Gerlinde/Schaufel/für Jose/test_mRNATrafo_HuH7A549.nd2');
      setOutCurrentPath('/project/ag-moonraedler/projects/Liscator/analysed_output_folders/test_mRNATrafo_HuH7A549/');
    }
    setNd2SelectedItem(`Selected: ${nd2CurrentPath}`);
    setOutSelectedItem(`Selected: ${outCurrentPath}`);
  };

  const handleScrollEvent = (e: React.WheelEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    // Check if scrolling up and already at top
    if (e.deltaY < 0 && scrollTop === 0) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Check if scrolling down and already at bottom
    if (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Always stop propagation to prevent page scroll
    e.stopPropagation();
  };

  const submitPaths = async (redirectTo: 'view' | 'analysis') => {
    const pathData: PathSelection = {
      nd2_path: nd2SelectedItem || nd2CurrentPath,
      out_path: outSelectedItem || outCurrentPath,
      redirect_to: redirectTo
    };

    try {
      const response = await selectPaths(pathData);
      if (response.data.status === 'success') {
        navigate(`/${redirectTo}`);
      }
    } catch (error) {
      console.error('Error selecting paths:', error);
      alert('Error selecting paths. Please check your selections.');
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🔬</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Pyama</h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🔬</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pyama Scientific Image Processing</h1>
          <p className="text-gray-600 text-lg">Advanced microscopy analysis and particle tracking</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ND2 File Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">📁</span> ND2 File Selection
              </h2>
              <p className="text-blue-100 text-sm">Select your microscopy data file</p>
            </div>
            <div className="p-6">
              <div className="flex mb-4">
                <input
                  type="text"
                  value={nd2CurrentPath}
                  readOnly
                  className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm font-mono"
                />
                <button 
                  onClick={() => goUpDirectory('nd2')}
                  className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  ↑
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg h-64 overflow-y-auto bg-gray-50 overscroll-contain" onWheel={handleScrollEvent}>
                {nd2Files.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📂</span>
                      <p>No files found</p>
                    </div>
                  </div>
                ) : (
                  nd2Files.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 cursor-pointer transition-all duration-150 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${
                        item.isDirectory 
                          ? 'font-semibold text-blue-700 hover:bg-blue-100' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                      onClick={() => handleItemClick(item, 'nd2')}
                    >
                      <span className="mr-3">{item.isDirectory ? '📁' : '📄'}</span>
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))
                )}
              </div>
              
              {nd2SelectedItem && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="inline-block px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded mb-2">Selected</span>
                  <p className="text-sm text-blue-700 font-mono break-all">{nd2SelectedItem}</p>
                </div>
              )}
            </div>
          </div>

          {/* Output Folder Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">📂</span> Output Folder
              </h2>
              <p className="text-emerald-100 text-sm">Choose where to save results</p>
            </div>
            <div className="p-6">
              <div className="flex mb-4">
                <input
                  type="text"
                  value={outCurrentPath}
                  readOnly
                  className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-sm font-mono"
                />
                <button 
                  onClick={() => goUpDirectory('out')}
                  className="px-4 py-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
                >
                  ↑
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg h-64 overflow-y-auto bg-gray-50 overscroll-contain" onWheel={handleScrollEvent}>
                {outFiles.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📂</span>
                      <p>No files found</p>
                    </div>
                  </div>
                ) : (
                  outFiles.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 cursor-pointer transition-all duration-150 hover:bg-green-50 border-b border-gray-100 last:border-b-0 ${
                        item.isDirectory 
                          ? 'font-semibold text-green-700 hover:bg-green-100' 
                          : 'text-gray-700 hover:text-green-600'
                      }`}
                      onClick={() => handleItemClick(item, 'out')}
                    >
                      <span className="mr-3">{item.isDirectory ? '📁' : '📄'}</span>
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))
                )}
              </div>
              
              {outSelectedItem && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs rounded mb-2">Selected</span>
                  <p className="text-sm text-green-700 font-mono break-all">{outSelectedItem}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">🚀</span> Actions
              </h2>
              <p className="text-violet-100 text-sm">Start your analysis workflow</p>
            </div>
            <div className="p-6 space-y-4">
              <button 
                onClick={() => submitPaths('view')} 
                disabled={!nd2SelectedItem || !outSelectedItem}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <span className="mr-2">👁️</span> View Data
              </button>
              
              <button 
                onClick={() => submitPaths('analysis')} 
                disabled={!nd2SelectedItem || !outSelectedItem}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🔬</span> Start Analysis
              </button>
              
              <div className="border-t pt-4 mt-6">
                <p className="text-sm text-gray-600 mb-3 font-medium">Quick Setup:</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => setDefaultPaths('local')} 
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center justify-center"
                  >
                    <span className="mr-2">💻</span> Local Default
                  </button>
                  <button 
                    onClick={() => setDefaultPaths('remote')} 
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center justify-center"
                  >
                    <span className="mr-2">🌐</span> Remote Default
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-medium">Instructions:</span> Select your ND2 microscopy file and corresponding output folder, then choose an action to proceed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;