from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import os
from app.lib.game import GameEngine
from app.lib.world_loader import WorldLoader

router = APIRouter()
game_instances: Dict[str, GameEngine] = {}
world_loader = WorldLoader()

@router.get("/")
async def root():
    return {"message": "Welcome to Farsi Text Adventure Game API"}

@router.get("/worlds")
async def list_worlds():
    return {"worlds": list(world_loader.worlds.keys())}

class GameState(BaseModel):
    theme: str
    current_room: str
    inventory: List[str]
    history: List[str]

class MessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    theme: Optional[str] = None

class MessageResponse(BaseModel):
    session_id: str
    message: str
    game_state: Optional[GameState] = None

class GameCommand(BaseModel):
    session_id: str
    command: str
    world_id: Optional[str] = None

@router.post("/game/new")
async def new_game(world_id: str):
    if world_id not in world_loader.worlds:
        raise HTTPException(status_code=404, detail="World not found")
    
    import uuid
    session_id = str(uuid.uuid4())
    game_instances[session_id] = GameEngine(world_id)
    
    # Get initial room description
    game_state = game_instances[session_id].handle_look(None)
    return {
        "session_id": session_id,
        "game_state": game_state.dict()
    }

@router.post("/game/command")
async def process_command(command: GameCommand):
    game = game_instances.get(command.session_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    game_state = game.process_command(command.command)
    return game_state.dict()

@router.get("/api/game/load/{session_id}")
async def load_game(session_id: str):
    # Load saved game logic here
    pass 