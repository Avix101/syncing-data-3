const express = require('express');
const path = require('path');

const attach = (app) => {
  // Link static assets in the hosted folder to the pseudo-directory /assets
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../hosted/index.html`));
  });
};

module.exports = {
  attach,
};
