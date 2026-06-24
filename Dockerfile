# Build stage: compile ClojureScript → JS
FROM node:22-alpine AS builder
RUN apk add --no-cache openjdk21-jre
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx shadow-cljs release app

# Serve stage: static files only
FROM nginx:alpine
COPY --from=builder /app/public /usr/share/nginx/html
