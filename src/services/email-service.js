'use strict';

const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_KEY);

exports.send = async (to, subject, body) => {
    const msg = {
        to: to,
        from: 'will.roc@hotmail.com',
        subject: subject,
        html: body,
    }

    sendgrid.send(msg)
        .then(() => {
            console.log('Email submitted successfully!!');
        })
        .catch((error) => {
            console.error('Failed to send email: ' + error);
        })
}