from groq import Groq
from app.config import settings
from typing import Optional

client = Groq(api_key=settings.GROQ_API_KEY)

async def aria_chat(messages: list, system_prompt: Optional[str] = None) -> str:
    """
    Compliance AI Response Interface Agent (ARIA)
    Handles conversational compliance queries using Groq API
    """
    try:
        if system_prompt:
            messages = [{"role": "system", "content": system_prompt}] + messages
        
        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=messages,
            temperature=0.7,
            max_tokens=1000,
        )
        
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"ARIA chat failed: {str(e)}")

async def extract_compliance_requirements(document_text: str) -> dict:
    """Extract compliance requirements from document text"""
    try:
        response = await aria_chat(
            [{"role": "user", "content": f"Extract compliance requirements from:\n\n{document_text}"}],
            system_prompt="You are a compliance expert. Extract key compliance requirements and return them in a structured format."
        )
        return {"requirements": response}
    except Exception as e:
        raise Exception(f"Requirement extraction failed: {str(e)}")
