from fastapi import APIRouter, HTTPException, Query
import os
from typing import Optional
from pathlib import Path

from ..models import DirectoryResponse, DirectoryItem, FolderSelection, StatusResponse

router = APIRouter()


@router.get("/list_directory", response_model=DirectoryResponse)
async def list_directory(path: str = Query(default="~")):
    try:
        # If path is "~" or empty, use home directory
        if path == "~" or path == "":
            path = str(Path.home())
        # Expand user path if it starts with ~
        elif path.startswith("~"):
            path = os.path.expanduser(path)
            
        items = os.listdir(path)
        directory_items = [
            DirectoryItem(
                name=item, 
                isDirectory=os.path.isdir(os.path.join(path, item))
            ) 
            for item in items
        ]
        return DirectoryResponse(path=path, items=directory_items)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/select_folder")
async def select_folder(data: FolderSelection):
    return StatusResponse(status="success", message=f"Folder selected: {data.path}")


@router.get("/home_directory")
async def get_home_directory():
    try:
        home_path = str(Path.home())
        return {"path": home_path}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))