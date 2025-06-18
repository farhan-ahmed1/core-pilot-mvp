FROM python:3.11-slim

WORKDIR /app

# Copy Auth service requirements and install dependencies
COPY auth_service/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy all backend code into the container
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH="/app"

# Command to run the application
CMD ["uvicorn", "auth_service.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]