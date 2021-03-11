const express = require('express');
const path = require('path');
const { v4 } = require('uuid');
const app = express();

let CONTACTS = [];

app.use(express.json());

//GET
app.get('/app/contacts', (req, res) => {
  setTimeout(() => {
    res.status(200).json(CONTACTS);
  }, 1000);
});

//POST
app.post('/app/contacts', (req, res) => {
  //   console.log(req.body);
  const contact = { ...req.body, id: v4(), marked: false };

  CONTACTS.push(contact);

  res.status(201).json(contact);
});

//DELETE
app.delete('/app/contacts/:id', (req, res) => {
  CONTACTS = CONTACTS.filter((el) => el.id !== req.params.id);

  res.status(200).json({ message: 'контакт удален' });
});

//PUT
app.put('/app/contacts/:id', (req, res) => {
  const idx = CONTACTS.findIndex((el) => el.id === req.params.id);
  //   const idx = CONTACTS.map((el) => el.id).indexOf(req.params.id);
  console.log(idx);
  CONTACTS[idx] = req.body;
  res.json(CONTACTS[idx]);
});

app.use(express.static(path.resolve(__dirname, 'client')));

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.listen(5500, () => {
  console.log('server work');
});
