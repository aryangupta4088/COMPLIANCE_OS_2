import boto3
from app.config import settings

# Initialize R2 client
s3_client = boto3.client(
    's3',
    endpoint_url=settings.R2_ENDPOINT_URL,
    aws_access_key_id=settings.R2_ACCESS_KEY,
    aws_secret_access_key=settings.R2_SECRET_KEY,
)

async def upload_to_r2(file_name: str, file_content: bytes) -> str:
    """Upload file to Cloudflare R2"""
    try:
        s3_client.put_object(
            Bucket=settings.R2_BUCKET_NAME,
            Key=file_name,
            Body=file_content,
        )
        url = f"{settings.R2_ENDPOINT_URL}/{settings.R2_BUCKET_NAME}/{file_name}"
        return url
    except Exception as e:
        raise Exception(f"R2 upload failed: {str(e)}")

async def download_from_r2(file_name: str) -> bytes:
    """Download file from R2"""
    try:
        response = s3_client.get_object(
            Bucket=settings.R2_BUCKET_NAME,
            Key=file_name,
        )
        return response['Body'].read()
    except Exception as e:
        raise Exception(f"R2 download failed: {str(e)}")
