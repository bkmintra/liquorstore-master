const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

console.log("✅ โหลดไฟล์ routes/auth.js สำเร็จแล้ว!");

// 📌 ชี้ Path ไปที่ไฟล์ auth_user.json (ตรวจสอบ Path ให้ตรงกับโฟลเดอร์ของคุณ)
const usersFilePath = path.join(__dirname, '../data/auth_user.json');


// ==========================================
// 🟢 1. API สำหรับ Login (รองรับการยิงมาที่ /api/login)
// ==========================================
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Server error: อ่านไฟล์ไม่ได้' });

        try {
            const users = JSON.parse(data);
            // ค้นหา User ที่ username และ password ตรงกัน
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // 🌟 ล็อกอินสำเร็จ
                res.status(200).json({ 
                    message: 'Login successful!', 
                    token: 'mock-jwt-token-123', 
                    user: { username: user.username }
                });
            } else {
                // ❌ รหัสผิด หรือ ไม่มีอีเมลนี้
                res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
            }
        } catch (parseErr) {
            res.status(500).json({ error: 'JSON Format Error' });
        }
    });
});

// ==========================================
// 🔵 2. API สำหรับ Register (รองรับการยิงมาที่ /api/auth/register)
// ==========================================
router.post('/auth/register', (req, res) => {
    const { username, password, first_name } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Server error: อ่านไฟล์ไม่ได้' });

        try {
            let users = JSON.parse(data);
            
            // เช็คว่าอีเมลซ้ำไหม
            if (users.some(user => user.username === username)) {
                return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
            }

            // สร้าง User ใหม่
            const newUser = { 
                username, 
                password, 
                first_name, 
                date_of_registration: new Date().toISOString().split('T')[0] 
            };
            users.push(newUser);

            // บันทึกไฟล์
            fs.writeFile(usersFilePath, JSON.stringify(users, null, 4), (writeErr) => {
                if (writeErr) return res.status(500).json({ error: 'ไม่สามารถบันทึกข้อมูลได้' });
                res.status(201).json({ message: 'Registration successful' });
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'JSON Format Error' });
        }
    });
});


// 📌 ส่งออก Router
module.exports = router;