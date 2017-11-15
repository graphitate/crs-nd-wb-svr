const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

hbs.registerPartials(__dirname + '/views/partials/');

app.set('view engine', 'hbs');

app.use((req, res, next) => {
  //use next() when ready to continue
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log.');
    }
  });
  next();
});

const maintenanceMode = false;

app.use((req, res, next) => {
  if (maintenanceMode) {
    res.render('maintenance.hbs');
  } else {
    next();
  }
});

app.use(express.static(__dirname +'/public'));


hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) =>{
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my homepage'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'This is an error message.'
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000!')
});

