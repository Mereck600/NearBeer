// server/routes/crawls.js
const express = require('express');
const Crawl = require('../models/Crawl');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/crawls - list user crawls
router.get('/', auth, async (req, res) => {
  try {
    const crawls = await Crawl.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(crawls);
  } catch (err) {
    console.error('Error fetching crawls', err);
    res.status(500).json({ message: 'Failed to fetch crawls' });
  }
});

// POST /api/crawls - create new crawl
router.post('/', auth, async (req, res) => {
  try {
    const { name, stops } = req.body;
    if (!name || !Array.isArray(stops) || stops.length === 0) {
      return res.status(400).json({ message: 'Name and at least one stop required' });
    }

    const crawl = await Crawl.create({
      user: req.user.id,
      name,
      stops,
    });

    res.status(201).json(crawl);
  } catch (err) {
    console.error('Error creating crawl', err);
    res.status(500).json({ message: 'Failed to create crawl' });
  }
});

// GET /api/crawls/:id - get single crawl
router.get('/:id', auth, async (req, res) => {
  try {
    const crawl = await Crawl.findOne({ _id: req.params.id, user: req.user.id });
    if (!crawl) return res.status(404).json({ message: 'Not found' });
    res.json(crawl);
  } catch (err) {
    console.error('Error fetching crawl', err);
    res.status(500).json({ message: 'Failed to fetch crawl' });
  }
});

// DELETE /api/crawls/:id - delete one crawl for current user
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Crawl.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Crawl not found' });
    }

    return res.status(200).json({ message: 'Crawl deleted' });
  } catch (err) {
    console.error('Error deleting crawl', err);
    return res.status(500).json({ message: 'Failed to delete crawl' });
  }
});


module.exports = router;
