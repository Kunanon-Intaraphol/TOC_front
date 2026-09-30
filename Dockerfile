# ---------- base ----------
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---------- dev (hot reload) ----------
FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------- build (static bundle in /app/dist) ----------
FROM base AS build
# Inlined by Vite at build time; nginx proxies this path to the backend
ENV VITE_API_BASE_URL=
RUN npm ci
COPY . .
RUN npm run build

# ---------- prod (nginx serving the bundle) ----------
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
