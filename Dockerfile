FROM node:20 AS build
ARG VITE_BACKEND_URL=http://localhost:3001/api/v1
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# old block
# FROM nginx AS final
# WORKDIR /usr/share/nginx/html
# COPY --from=build /build/dist .

# new block
EXPOSE 3000
# Start the SSR server
CMD ["npm", "start"]
