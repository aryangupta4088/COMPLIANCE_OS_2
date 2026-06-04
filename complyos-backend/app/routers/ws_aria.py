from fastapi import APIRouter, WebSocket
from app.agents import aria
import json

router = APIRouter(prefix="/ws", tags=["websocket"])

@router.websocket("/aria")
async def websocket_aria_endpoint(websocket: WebSocket):
    """WebSocket endpoint for ARIA chat"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process message with ARIA
            response = await aria.aria_chat(
                [{"role": "user", "content": message_data.get("message")}]
            )
            
            await websocket.send_json({
                "type": "response",
                "content": response,
            })
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "error": str(e),
        })
        await websocket.close()
