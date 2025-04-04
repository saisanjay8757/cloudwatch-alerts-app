FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Create necessary directories
RUN mkdir -p /app/logs

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "src/server.js"]
