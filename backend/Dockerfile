FROM node:20

# Set working directory
WORKDIR /

# Copy package files first (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY public public
COPY src src
COPY index.js index.js

# Expose port
EXPOSE 8000

# Command to run the app
CMD ["node", "index.js"]
