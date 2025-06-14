FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (in the Docker container)
RUN npm install

# Now copy the rest of the source code
COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]

