# # Use official Node 18 image
# FROM node:18

# # Install bash and MySQL client
# RUN apt-get update && apt-get install -y bash default-mysql-client && rm -rf /var/lib/apt/lists/*

# # Set working directory
# WORKDIR /app

# # Copy package.json and install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy app code
# COPY . .

# # Expose backend port
# EXPOSE 4000

# # Default command: run wait.sh
# CMD ["bash", "./wait.sh"]


FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN chmod +x wait.sh

EXPOSE 4000

CMD ["./wait.sh"]

