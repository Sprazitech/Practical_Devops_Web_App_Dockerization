

FROM node:18

RUN apt-get update && apt-get install -y bash default-mysql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN chmod +x wait.sh

EXPOSE 4000

CMD ["bash", "wait.sh"]
