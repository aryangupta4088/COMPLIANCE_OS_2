from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.config import settings
from app.routers import (
    auth, ws_aria, business, compliance, documents, ca, loans,
    freelancers, notifications, registration, admin, schemes, dashboard
)

app = FastAPI(title=settings.APP_NAME)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event handlers
@app.on_event("startup")
async def startup():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown():
    await close_mongo_connection()

# Include routers
app.include_router(auth.router)
app.include_router(ws_aria.router)
app.include_router(business.router)
app.include_router(compliance.router)
app.include_router(documents.router)
app.include_router(ca.router)
app.include_router(loans.router)
app.include_router(freelancers.router)
app.include_router(notifications.router)
app.include_router(registration.router)
app.include_router(admin.router)
app.include_router(schemes.router)
app.include_router(dashboard.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
