
# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies.
RUN yarn --ignore-engines

# Copy the current directory contents into the container at /app
COPY . .

# Build the TypeScript
RUN yarn build

# Make port 80 available to the world outside this container
EXPOSE 80

# Run the app when the container launches
CMD ["yarn", "start"]