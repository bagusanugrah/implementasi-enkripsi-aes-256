## Cara instalasi dan penggunaan:
1. Pastikan Node.js dan MySQL sudah terinstall di computer.
2. Buka **aes-key** kemudian jalankan
```bash
npm install
```
4. Buka **gene-care-app** kemudian jalankan
```bash
npm install
```
6. Isi **.env** yang ada di **aes-key** dan **gene-care-app**. **SESSION_SECRET** diisi dengan random string atau 32 bytes hex. **ENCRYPTION_KEY** dan **AES_KEY** diisi dengan 32 bytes hex yang berbeda. **ENCRYPTION_KEY** yang di **aes-key** dan di **gene-care-app** harus sama. 32 bytes hex bisa didapatkan dengan menjalankan **generate_32_bytes_hex.js** di **gene-care-app** dengan perintah
```bash
node generate_32_bytes_hex.js
```
7. Import **gene_care.sql** ke MySQL dengan nama database gene_care
8. Jalankan **aes-key** terlebih dulu dengan perintah
```bash
node app.js
```
9. Baru jalankan **gene-care-app** dengan perintah
```bash
node src/app.js
```
10. **aes-key** dapat dibuka di browser dengan alamat
```bash
http://localhost:3001/AES-KEY
```
11. **gene-care-app** dapat dibuka di browser dengan alamat
```bash
http://localhost:3000
```
<br/>
Keterangan:<br/>
<b>SESSION_SECRET</b> itu untuk login session.<br/>
<b>ENCRYPTION_KEY</b> itu untuk mengenkrip dan mendekrip AES_KEY<br/>
<b>AES_KEY</b> itu untuk mengenkrip dan mendekrip data DNA dan medical record<br/>
<br/>
Login admin:<br/>
username: anugrah<br/>
password: anugrah
