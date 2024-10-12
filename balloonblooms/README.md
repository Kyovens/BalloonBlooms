# PERSIAPAN SERVER
- Buat folder baru
- Extract zip project ke folder yang sudah dibuat
- Buka VSCode, open folder project
- Buka terminal baru (Ctrl + J)
- Pilih terminal jenis CommandPrompt (cmd)
- Eksekusi command :
  > npm init

  > npm i nodemon express ejs mysql2 sequelize express-session multer socketio

  > nodemon index

  Note : npm init bisa di skip jika sudah ada file package.json
- Tahan Ctrl, klik link yang tertulis di terminal (Server running on ...)
- Atau buka link http://localhost:3000

## DATABASE ERROR
Jika username atau password database Anda tidak sesuai dan muncul error "Access denied for user ..." saat server dijalankan, lakukan step berikut :
  - Buka file /models/model.js
  - Pada variabel "username" dan "password", ubah sesuai username dan password database Anda
  - Save file

Jalankan ulang server dengan 

  > nodemon index