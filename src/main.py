from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.application.web.controllers.user_controller import user_controller
from fastapi.responses import JSONResponse
from src.application.web.controllers.patient_data_controller import pateiend_router
from src.application.web.controllers.chat_controller import chat_router

app = FastAPI()


origins = [
    "*",
]

# Add middlewares to the origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_controller, prefix="/users", tags=["users"])
app.include_router(pateiend_router, prefix="/patient", tags=["users"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])


# Health check endpoint
@app.get("/health")
async def health_check():
    return JSONResponse(status_code=200, content={"status": "healthy"})


@app.get("/")
async def health_check():
    return JSONResponse(status_code=200, content={"status": "healthy"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app)
