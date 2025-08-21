FROM node:20

# Create app dir
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose service port
EXPOSE 5000

CMD ["npm", "start"]
