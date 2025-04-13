# Gunakan image Node.js
FROM node:18

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install semua dependencies termasuk devDependencies
RUN npm install

# Salin seluruh source code ke container
COPY . .

# Jalankan aplikasi dengan nodemon
CMD ["npx", "nodemon", "index.js"]

# Buka port yang digunakan Express
EXPOSE 3000
