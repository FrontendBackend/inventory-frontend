# Usar una imagen base de Node.js
# FROM node:16.10

# Establecer el directorio de trabajo dentro del contenedor
# WORKDIR /app

# Copiar el archivo package.json y package-lock.json al directorio de trabajo
# COPY package*.json ./

# Instalar las dependencias del proyecto
# RUN npm install

# Copiar el resto de los archivos del proyecto al directorio de trabajo
# COPY . .

# Construir la aplicación Angular
# RUN npm run build --prod

# Exponer el puerto en el que se ejecutará la aplicación Angular
# EXPOSE 80

# Comando para ejecutar la aplicación Angular
# CMD ["npm", "start"]

#Primera Etapa
FROM node:16-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

#Segunda Etapa
FROM nginx:1.17.1-alpine

#Si estas utilizando otra aplicacion cambia PokeApp por el nombre de tu app
COPY --from=build-step /app/dist/inventory.frontend /usr/share/nginx/html
