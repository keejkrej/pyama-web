from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
import sys
import os

# Add the backend directory to the path to import existing modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from ..models import (
    PathSelection, ImageUpdate, ParticleEnabledUpdate, 
    ImageResponse, ViewResponse, StatusResponse
)
from ..services.cell_viewer import CellViewer

router = APIRouter()

# Global state - in production, consider using dependency injection or session management
cell_viewer: Optional[CellViewer] = None


def get_cell_viewer():
    global cell_viewer
    if cell_viewer is None:
        raise HTTPException(status_code=400, detail="Cell viewer not initialized")
    return cell_viewer


@router.post("/select_paths")
async def select_paths(data: PathSelection):
    global cell_viewer
    
    if not data.nd2_path or not data.out_path:
        raise HTTPException(status_code=400, detail="Both ND2 path and output path must be selected")
    
    init_type = 'view' if data.redirect_to == 'view' else 'analysis'
    cell_viewer = CellViewer(nd2_path=data.nd2_path, output_path=data.out_path, init_type=init_type)
    cell_viewer.nd2_path = data.nd2_path
    cell_viewer.output_path = data.out_path
    
    return {"redirect": data.redirect_to, "status": "success"}


@router.get("/view", response_model=ViewResponse)
async def get_view(cv: CellViewer = Depends(get_cell_viewer)):
    cv.position_changed()
    current_particle_index = cv.particle_index()
    
    return ViewResponse(
        channel_image=cv.return_image(),
        n_positions=len(cv.positions),
        n_channels=cv.channel_max,
        n_frames=cv.frame_max,
        all_particles_len=cv.all_particles_len,
        current_particle_index=current_particle_index,
        brightness_plot=cv.brightness_plot,
        disabled_particles=cv.disabled_particles
    )


@router.post("/update_image", response_model=ImageResponse)
async def update_image(data: ImageUpdate, cv: CellViewer = Depends(get_cell_viewer)):
    if data.position != cv.position:
        cv.position = cv.position_options[data.position]
        cv.position_changed()
    
    if data.particle != cv.particle:
        cv.particle = cv.all_particles[data.particle]
        cv.particle_changed()
    
    cv.channel = data.channel
    cv.frame = data.frame
    
    cv.get_channel_image()
    cv.draw_outlines()
    
    return ImageResponse(
        channel_image=cv.return_image(),
        brightness_plot=cv.brightness_plot,
        all_particles_len=cv.all_particles_len,
        particle_enabled=cv.particle_enabled,
        current_particle=cv.particle,
        disabled_particles=cv.disabled_particles
    )


@router.post("/update_particle_enabled", response_model=ImageResponse)
async def update_particle_enabled(data: ParticleEnabledUpdate, cv: CellViewer = Depends(get_cell_viewer)):
    cv.particle_enabled = data.enabled
    cv.particle_enabled_changed()
    
    return ImageResponse(
        channel_image=cv.return_image(),
        brightness_plot=cv.brightness_plot,
        all_particles_len=cv.all_particles_len,
        disabled_particles=cv.disabled_particles
    )