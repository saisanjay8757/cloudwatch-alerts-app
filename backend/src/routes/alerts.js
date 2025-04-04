const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { Op } = require('sequelize');

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const { state, instanceId, accountId, limit = 100 } = req.query;
    
    const where = {};
    if (state) where.state = state;
    if (instanceId) where.instanceId = instanceId;
    if (accountId) where.accountId = accountId;

    const alerts = await Alert.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resolve an alert
router.put('/:id/resolve', async (req, res) => {
  try {
    const { resolvedBy } = req.body;
    
    if (!resolvedBy) {
      return res.status(400).json({ error: 'resolvedBy is required' });
    }

    const alert = await Alert.findByPk(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const updatedAlert = await alert.update({
      state: 'OK',
      resolvedBy,
      resolvedAt: new Date()
    });

    res.json(updatedAlert);
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
