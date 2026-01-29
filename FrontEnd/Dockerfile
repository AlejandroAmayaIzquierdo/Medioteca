# Etapa 1: Build
FROM node:alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install

COPY . .
RUN ng build --configuration=production --base-href /app/ --deploy-url /app/

# Etapa 2: Servir con nginx
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados
COPY --from=build /usr/src/app/dist/medioteca-client/browser /usr/share/nginx/html

EXPOSE 3000
