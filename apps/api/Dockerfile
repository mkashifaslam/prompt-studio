FROM node:24-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm install reflect-metadata && npm install && npm cache clean --force

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "dist/main.js"]
