# --- ЕТАП 1: Збірка React-додатка ---
FROM node:20-alpine AS build
WORKDIR /app

# Копіюємо файли залежностей і встановлюємо їх
COPY package*.json ./
RUN npm install

# Копіюємо весь код фронтенду і збираємо проект
COPY . .
RUN npm run build

# --- ЕТАП 2: Запуск Nginx ---
FROM nginx:stable-alpine

# Копіюємо конфігурацію Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копіюємо згенеровану папку dist З ПОПЕРЕДНЬОГО ЕТАПУ (build) в Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]