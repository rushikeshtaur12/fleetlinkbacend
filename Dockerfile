# Use Node.js LTS version
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose API port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
