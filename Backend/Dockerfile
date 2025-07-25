# Use an official Node.js runtime as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "src/index.js"]
