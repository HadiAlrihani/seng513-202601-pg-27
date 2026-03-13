# uses Node.js image as base for the container
FROM node:20-alpine

# sets /app as the working directory inside the container
WORKDIR /app 

# copies the project dependency files into the container
COPY package*.json ./

# installs all required Node.js packagaes
RUN npm install

# copies the rest of the server files into the container
COPY . .

# indicates that the server runs on port 5000
EXPOSE 5000

# starts the server using the start script defined in package.json
CMD ["npm", "start"]