from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Optional
import sys
import os

# Add the backend directory to the path to import existing modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from ..models import (
    SegmentationRequest, TrackingRequest, SquareROIRequest, 
    ExportRequest, AnalysisResponse, StatusResponse
)
from ..services.cell_viewer import CellViewer
from ..services import pyama_util

router = APIRouter()

# Global state - in production, consider using dependency injection or session management
cell_viewer: Optional[CellViewer] = None


def get_cell_viewer():
    # Import from images router to share the global state
    from .images import cell_viewer as global_cell_viewer
    if global_cell_viewer is None:
        raise HTTPException(status_code=400, detail="Cell viewer not initialized")
    return global_cell_viewer


@router.get("/analysis", response_model=AnalysisResponse)
async def get_analysis(cv: CellViewer = Depends(get_cell_viewer)):
    n_positions = len(cv.nd2.metadata['fields_of_view']) + 1
    return AnalysisResponse(
        n_positions=n_positions,
        n_channels=cv.channel_max,
        n_frames=cv.frame_max
    )


@router.post("/do_segmentation")
async def do_segmentation(
    data: SegmentationRequest, 
    background_tasks: BackgroundTasks,
    cv: CellViewer = Depends(get_cell_viewer)
):
    nd2_path = cv.nd2_path
    out_dir = cv.output_path
    positions = list(range(data.position_min, data.position_max + 1))
    
    segmentation_channel = []
    fluorescence_channels = []
    
    # Process channel assignments
    for i in range(cv.channel_max + 1):
        channel_attr = f'channel_{i}'
        if hasattr(data, channel_attr):
            channel_type = getattr(data, channel_attr)
            if channel_type == 'Brightfield':
                segmentation_channel.append(i)
            elif channel_type == 'Fluorescent':
                fluorescence_channels.append(i)
    
    segmentation_channel = segmentation_channel[0] if len(segmentation_channel) == 1 else segmentation_channel
    
    # Run segmentation in background
    background_tasks.add_task(
        pyama_util.segment_positions,
        nd2_path, out_dir, positions, segmentation_channel, fluorescence_channels,
        frame_min=data.frame_min, frame_max=data.frame_max
    )
    
    return StatusResponse(status="processing", message="Segmentation started in background")


@router.post("/do_tracking")
async def do_tracking(
    data: TrackingRequest,
    background_tasks: BackgroundTasks, 
    cv: CellViewer = Depends(get_cell_viewer)
):
    out_dir = cv.output_path
    positions = list(range(data.position_min, data.position_max + 1))
    
    background_tasks.add_task(
        pyama_util.tracking_pyama,
        out_dir, positions, expand=data.expand_labels
    )
    
    return StatusResponse(status="processing", message="Tracking started in background")


@router.post("/do_square_rois")
async def do_square_rois(
    data: SquareROIRequest,
    background_tasks: BackgroundTasks,
    cv: CellViewer = Depends(get_cell_viewer)
):
    out_dir = cv.output_path
    positions = list(range(data.position_min, data.position_max + 1))
    
    background_tasks.add_task(
        pyama_util.square_roi,
        out_dir, positions, data.square_size
    )
    
    return StatusResponse(status="processing", message="Square ROI generation started in background")


@router.post("/do_export")
async def do_export(
    data: ExportRequest,
    background_tasks: BackgroundTasks,
    cv: CellViewer = Depends(get_cell_viewer)
):
    out_dir = cv.output_path
    positions = list(range(data.position_min, data.position_max + 1))
    
    try:
        background_tasks.add_task(
            pyama_util.csv_output,
            out_dir, positions, data.minutes
        )
        return StatusResponse(status="processing", message="Export started in background")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Export failed: {str(e)}")