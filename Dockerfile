# 1. Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssl

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (sin usar las del host)
RUN npm install -g prisma && npm install --legacy-peer-deps

# Solución al error de permisos con Next.js
RUN chmod +x node_modules/.bin/next

# Copiar todo el proyecto
COPY . .

# Build de la app Next.js
RUN npm run build

# 2. Etapa de producción
FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache openssl nginx nano tzdata

# Configurar zona horaria
RUN cp /usr/share/zoneinfo/America/Lima /etc/localtime && \
    echo "America/Lima" > /etc/timezone

# Copiar solo lo necesario desde la etapa anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

# Ejecutar la app (ajusta si usas server custom)
CMD ["npm", "start"]
