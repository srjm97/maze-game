FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
COPY backend/.env .env
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
