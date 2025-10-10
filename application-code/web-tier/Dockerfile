# ---------- Stage 1: Build the React App ----------
FROM node:18-alpine AS build
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build React app
RUN npm run build

# ---------- Stage 2: Serve the build with Nginx ----------
FROM nginx:alpine

# Copy React build files to Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the container
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]