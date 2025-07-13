import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PathSelection {
  nd2_path: string;
  out_path: string;
  redirect_to: string;
}

export interface ImageUpdate {
  position: number;
  channel: number;
  frame: number;
  particle: number;
}

export interface ParticleEnabledUpdate {
  enabled: boolean;
}

export interface SegmentationRequest {
  position_min: number;
  position_max: number;
  frame_min: number;
  frame_max: number;
  channel_0: string;
  channel_1?: string;
  channel_2?: string;
  channel_3?: string;
  channel_4?: string;
}

export interface TrackingRequest {
  position_min: number;
  position_max: number;
  expand_labels: boolean;
}

export interface SquareROIRequest {
  position_min: number;
  position_max: number;
  square_size: number;
}

export interface ExportRequest {
  position_min: number;
  position_max: number;
  minutes: number;
}

export interface ViewResponse {
  channel_image: string;
  n_positions: number;
  n_channels: number;
  n_frames: number;
  all_particles_len: number;
  current_particle_index: number;
  brightness_plot: string;
  disabled_particles: number[];
}

export interface ImageResponse {
  channel_image: string;
  brightness_plot: string;
  all_particles_len: number;
  particle_enabled?: boolean;
  current_particle?: number;
  disabled_particles: number[];
}

export interface AnalysisResponse {
  n_positions: number;
  n_channels: number;
  n_frames: number;
}

export interface DirectoryResponse {
  path: string;
  items: {
    name: string;
    isDirectory: boolean;
  }[];
}

export interface StatusResponse {
  status: string;
  message?: string;
}

// API functions
export const selectPaths = (data: PathSelection) => 
  api.post<{ redirect: string; status: string }>('/select_paths', data);

export const getView = () => 
  api.get<ViewResponse>('/view');

export const updateImage = (data: ImageUpdate) => 
  api.post<ImageResponse>('/update_image', data);

export const updateParticleEnabled = (data: ParticleEnabledUpdate) => 
  api.post<ImageResponse>('/update_particle_enabled', data);

export const getAnalysis = () => 
  api.get<AnalysisResponse>('/analysis');

export const doSegmentation = (data: SegmentationRequest) => 
  api.post<StatusResponse>('/do_segmentation', data);

export const doTracking = (data: TrackingRequest) => 
  api.post<StatusResponse>('/do_tracking', data);

export const doSquareROIs = (data: SquareROIRequest) => 
  api.post<StatusResponse>('/do_square_rois', data);

export const doExport = (data: ExportRequest) => 
  api.post<StatusResponse>('/do_export', data);

export const listDirectory = (path: string = '/') => 
  api.get<DirectoryResponse>('/list_directory', { params: { path } });

export const selectFolder = (path: string) => 
  api.post<StatusResponse>('/select_folder', { path });

export const getHomeDirectory = () => 
  api.get<{ path: string }>('/home_directory');

export default api;