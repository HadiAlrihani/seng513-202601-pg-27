FROM node:20

WORKDIR /app

# copy package files
COPY package*.json ./

# install dependencies
RUN npm install

# copy project files
COPY . .

# expose vite port
EXPOSE 5173

# start vite dev server
CMD ["npm", "run", "dev", "--", "--host"]