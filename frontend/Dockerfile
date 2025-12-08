# ---------- Build stage ----------
FROM node:18-alpine AS build

WORKDIR /app

# Install build tools (needed if any dependency uses node-gyp / native modules)
RUN apk add --no-cache python3 make g++

# Copy only package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
# If you have a package-lock.json, npm ci is stricter and faster
# Use ONE of these:
# RUN npm ci
RUN npm install

# Copy the rest of the app
COPY . .

# React env var for API URL (adjust if you use something else)
ENV REACT_APP_API_URL=https://javatreetech.com/api

# Build the production bundle
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:stable-alpine

# Copy your custom nginx.conf (adjust path if needed)
# If nginx.conf is in project root/nginx/nginx.conf and context is repo root,
# then in docker-compose.yaml you should have context: . and Dockerfile: ./frontend/Dockerfile
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Static files from build step
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

