from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class PathSelection(BaseModel):
    nd2_path: str
    out_path: str
    redirect_to: str


class ImageUpdate(BaseModel):
    position: int
    channel: int
    frame: int
    particle: int


class ParticleEnabledUpdate(BaseModel):
    enabled: bool


class SegmentationRequest(BaseModel):
    position_min: int
    position_max: int
    frame_min: int
    frame_max: int
    channel_0: str
    channel_1: Optional[str] = None
    channel_2: Optional[str] = None
    channel_3: Optional[str] = None
    channel_4: Optional[str] = None


class TrackingRequest(BaseModel):
    position_min: int
    position_max: int
    expand_labels: bool


class SquareROIRequest(BaseModel):
    position_min: int
    position_max: int
    square_size: float


class ExportRequest(BaseModel):
    position_min: int
    position_max: int
    minutes: float


class DirectoryItem(BaseModel):
    name: str
    isDirectory: bool


class DirectoryResponse(BaseModel):
    path: str
    items: List[DirectoryItem]


class FolderSelection(BaseModel):
    path: str


class ImageResponse(BaseModel):
    channel_image: str
    brightness_plot: str
    all_particles_len: int
    particle_enabled: Optional[bool] = None
    current_particle: Optional[int] = None
    disabled_particles: List[int]


class ViewResponse(BaseModel):
    channel_image: str
    n_positions: int
    n_channels: int
    n_frames: int
    all_particles_len: int
    current_particle_index: int
    brightness_plot: str
    disabled_particles: List[int]


class AnalysisResponse(BaseModel):
    n_positions: int
    n_channels: int
    n_frames: int


class StatusResponse(BaseModel):
    status: str
    message: Optional[str] = None