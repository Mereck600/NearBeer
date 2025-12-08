# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# CRA default port
EXPOSE 3000

# Start React dev server
CMD ["npm", "start"]
