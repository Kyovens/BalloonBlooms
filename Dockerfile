# Menggunakan image dasar Node.js
FROM node:14

# Mengatur direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Menginstal dependensi
RUN npm install

# Menyalin semua file dari direktori saat ini ke dalam kontainer
COPY . .

# Menyalin skrip wait-for-it ke dalam kontainer
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Mengekspos port yang digunakan oleh aplikasi
EXPOSE 3002

# Menjalankan aplikasi dengan wait-for-it
CMD ["wait-for-it", "db:3306", "--", "npm", "run", "start"]
