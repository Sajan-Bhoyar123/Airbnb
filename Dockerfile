# Use Node.js LTS
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy project files
COPY . .

# Expose the same port your Express app uses
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
