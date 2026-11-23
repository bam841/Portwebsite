# Dockerfile for React client
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Copy package definitions first (leverages layer caching)
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . ./

# Expose the dev server port (optional, for npm start)
EXPOSE 3000

# Default command – you can override with "npm start" or "npm run build"
CMD ["npm", "start"]
