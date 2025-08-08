import dotenv from 'dotenv';
dotenv.config();

import pool from '../services/db.js';

const seed = async () => {
  try {
    console.log('Seeding database with first 4 users');

    await pool.query('DELETE FROM users');

    await pool.query(`
        INSERT INTO users (name, image_url, score) VALUES 
            ($1, $2, $3),
            ($4, $5, $6),
            ($7, $8, $9),
            ($10, $11, $12)
        `, [
        'King Cat', 'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg', 100,
        'Bob the dog', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQpflckqTzo_CVJxHUPahKCrnIL3d2DIJn1ThfaalZfK682pUAn3mFidzfZM_yuLhNwHlLHRd_UkAVb_KZQfj4pnA', 150,
        'Charlie the hamster', 'https://www.rvc.ac.uk/Media/Default/Press%20Release/gibby_and_blue_flowers_1_-_Lisa_Haycock-fixed.jpg', 120,
        'Mimi the cow', 'https://b1157417.smushcdn.com/1157417/wp-content/uploads/2024/07/cow-close-up-of-dairy-cattle-825x550.jpg?lossy=1&strip=1&webp=0', 13,
        ]
    );

    console.log('Seed complete!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end(); 
  }
};

seed();
