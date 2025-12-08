# frontend/Dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------------------------
# Production Nginx web server
# ---------------------------

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom nginx config
COPY ../nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
