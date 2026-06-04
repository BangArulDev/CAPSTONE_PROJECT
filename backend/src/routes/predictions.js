const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const { generatePredictions } = require('../ai/predictor');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// Siapkan multer untuk menerima file di memory
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/predictions — AI-powered waste/energy predictions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: userLogs, error } = await supabase
      .from('logs')
      .select('*')
      .eq('userId', req.user.id)
      .order('date', { ascending: true });

    if (error) throw error;
    
    const predictions = generatePredictions(userLogs || []);

    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/predictions/scan — Menerima gambar dan meneruskannya ke Python API
router.post('/scan', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Gambar tidak ditemukan' });
    }

    // Siapkan data gambar untuk dikirim ke Python
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Gunakan URL dari environment variable, fallback ke localhost untuk development
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';
    
    // Kirim request ke API Python
    const pythonResponse = await axios.post(`${pythonApiUrl}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const hasilPrediksi = pythonResponse.data;

    // (OPSIONAL) Simpan ke Supabase jika diperlukan
    // await supabase.from('logs').insert([{ 
    //   userId: req.user.id, 
    //   type: 'scan_sampah', 
    //   detail: hasilPrediksi.predicted_class 
    // }]);

    res.json({
      success: true,
      data: hasilPrediksi
    });

  } catch (error) {
    console.error('Error saat menghubungi API Python:', error.message);
    res.status(500).json({ success: false, message: 'Gagal menganalisis gambar' });
  }
});

module.exports = router;
