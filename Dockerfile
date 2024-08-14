FROM node:18-alpine AS build
# This is exactly what you had before
WORKDIR /app
COPY ./package.json ./package.json
RUN yarn --ignore-engines
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./.env ./.env
RUN yarn build

# Now build the actual image, starting over.
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env ./.env
CMD ["node", "index.js"]