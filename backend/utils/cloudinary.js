// cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'abhaydixitdev',
    api_key: '428324638994712',
    api_secret: 'UTfWcvnDlyZNCqURKGF4ghtuAiQ',
});

module.exports = cloudinary;