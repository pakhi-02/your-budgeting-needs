FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/src ./src
EXPOSE 5001
CMD ["node", "src/index.js"]
