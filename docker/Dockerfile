FROM node:24-alpine AS build
ARG API_BASE_URL=http://localhost:8080/api/v1
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN sed -i "s|__API_BASE_URL__|${API_BASE_URL}|" src/environments/environment.prod.ts
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine
COPY --from=build /app/dist/linkly-web/browser /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
