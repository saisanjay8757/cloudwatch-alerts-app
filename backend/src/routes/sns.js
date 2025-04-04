const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const AWS = require('aws-sdk');

// Middleware to verify SNS signature
const verifySNSMessage = (req, res, next) => {
  // In production, you should verify the SNS message signature here
  // For development, we'll skip this verification
  next();
};

// Process SNS notifications
router.post('/', verifySNSMessage, async (req, res) => {
  try {
    // Handle subscription confirmation
    if (req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation') {
      const sns = new AWS.SNS({ region: 'ap-south-1' });
      await sns.confirmSubscription({
        Token: req.body.Token,
        TopicArn: req.body.TopicArn
      }).promise();
      return res.status(200).send('Subscription confirmed');
    }

    // Process CloudWatch alarm message
    const message = JSON.parse(req.body.Message);
    if (message.AlarmName) {
      const instanceDimension = message.Trigger.Dimensions.find(d => d.name === 'InstanceId');
      
      const alertData = {
        alertName: message.AlarmName,
        instanceId: instanceDimension ? instanceDimension.value : 'N/A',
        accountId: message.AWSAccountId,
        state: message.NewStateValue,
        rawData: message
      };

      await Alert.create(alertData);
      return res.status(200).send('Alert processed');
    }

    res.status(400).send('Unrecognized message format');
  } catch (error) {
    console.error('Error processing SNS message:', error);
    res.status(500).send('Error processing message');
  }
});

module.exports = router;
