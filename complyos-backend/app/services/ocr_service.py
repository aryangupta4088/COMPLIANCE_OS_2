import pytesseract
from PIL import Image
import io

async def ocr_image(image_bytes: bytes) -> str:
    """Extract text from image using OCR"""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        raise Exception(f"OCR processing failed: {str(e)}")

async def ocr_pdf(pdf_bytes: bytes) -> str:
    """Extract text from PDF pages"""
    try:
        # Would use pdfplumber for PDF processing
        return ""
    except Exception as e:
        raise Exception(f"PDF processing failed: {str(e)}")
