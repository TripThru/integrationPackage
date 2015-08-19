module.exports = {
  expressPort: 3303,
  expressUrl: 'your public url here',
  tripthru: {
    url: 'https://api.sandbox.tripthru.com/',
    cert: '../Credentials/.crt',
    key: '../Credentials/.key',
    passphrase: ''
  },
  db: {
    url: 'mongodb://localhost:27017/partners', 
    user: '', 
    password: ''
  }
};
