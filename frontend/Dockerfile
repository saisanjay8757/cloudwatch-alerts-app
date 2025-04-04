FROM node:16 as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install -g npm@8.19.4 && \
    npm install --legacy-peer-deps --force && \
    npm install ajv@6.12.6 ajv-keywords@3.5.2 --save-exact

# Copy app files
COPY public/ ./public/
COPY src/ ./src/

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
