from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

SECRET_KEY=os.getenv('SECRET_KEY')


MONGO_URI=os.getenv('MONGO_URI')
BASE_URL=os.getenv('BASE_URL')

AI71_API_KEY=os.getenv('AI71_API_KEY')
AI71_BASE_URL=os.getenv('AI71_BASE_URL')

OPEN_AI_API_KEY=os.getenv('OPENAI_KEY')

REDIS_ENDPOINT=os.getenv('REDIS_ENDPOINT')
REDIST_PASSWORD=os.getenv('REDIST_PASSWORD')