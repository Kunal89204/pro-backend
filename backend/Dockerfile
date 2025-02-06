FROM node

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and other necessary files
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY public public
COPY src src
COPY .env .env

# Install dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 8000

# Set the command to run your app
CMD ["node", "src/index.js"]
