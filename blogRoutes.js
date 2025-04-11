const express = require('express');
const multer = require('multer');
const BlogPost = require('../models/BlogPost');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'backend/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('featuredImage'), async (req, res) => {
  const { title, slug, content, metaTitle, metaDescription, metaKeywords, category, tags } = req.body;
  const blog = new BlogPost({
    title,
    slug,
    content,
    featuredImage: req.file ? `/uploads/${req.file.filename}` : '',
    metaTitle,
    metaDescription,
    metaKeywords,
    category,
    tags: tags ? tags.split(',') : []
  });
  try {
    const saved = await blog.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
