# Start from Ubuntu 22.04
FROM ubuntu:22.04

# Avoid interactive prompts during install
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend dependencies first
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend/ .

# Expose port 8000 for API
EXPOSE 8000

# Start the backend app
CMD ["node", "server.js"]
