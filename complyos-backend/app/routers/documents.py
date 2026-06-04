from fastapi import APIRouter, UploadFile, File, HTTPException
from app.agents import veda

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), business_id: str = None):
    """Upload and process document with VEDA"""
    try:
        content = await file.read()
        file_type = file.filename.split(".")[-1].lower()
        
        result = await veda.extract_veda_data(content, file_type)
        
        return {
            "id": "doc123",
            "filename": file.filename,
            "status": "processed",
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def list_documents(business_id: str):
    """List documents for a business"""
    try:
        # API implementation will be added
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
