# Use the official Node image as base
FROM node:20

RUN apt-get update -y && apt-get install -y \
    libicu-dev \
    libmariadb-dev \
    unzip zip \
    zlib1g-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    nano 
# Set the working directory inside the container
WORKDIR /var/www/html/

COPY . . 

# Ajusta los permisos
RUN chmod -R 755 /var/www/html
RUN chown -R www-data:www-data /var/www/html 

# Install dependencies
RUN npm install 

# Build the Angular application
RUN npm run build --prod

# Expose the port the app runs on
EXPOSE 80

# Start the application
CMD ["npm", "start"]
