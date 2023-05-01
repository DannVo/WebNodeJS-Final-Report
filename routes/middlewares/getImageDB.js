const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const UserAccount = require('../../app/models/UserAccount')
const assert = require('assert');
const { Readable } = require('stream');


const url = 'mongodb+srv://anthonyvo:AnthonyVo378@test.csv7oin.mongodb.net/test?retryWrites=true&w=majority'
const client = new MongoClient(url)

async function getImage(req, res, next) {
  
  if(!req.session.avatar){
    return next()
  }
  try {
    // MongoClient connection code gooes collection
    await client.connect()
    const db = client.db('test')

    const email = req.session.email
    let userEmail = email.substring(0, email.indexOf("@"))
    const bucket = new GridFSBucket(db, {bucketName: `${userEmail.toString()}.avatars`})    
    const fileId = new ObjectId(req.session.avatar)
    

    console.log("email: ",userEmail)
    console.log("avatar: ",req.session.avatar)
    console.log("file id: ", fileId)
    let downloadStream = bucket.openDownloadStream(fileId)
    
    let buffer = [];
    downloadStream.on('data', function(chunk) {
      buffer.push(chunk);
      console.log(typeof chunk)
      // return res.status(200).write(chunk);
    });

    downloadStream.on("error", function (err) {
      console.log("Error: ", err)
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on('end', async function() {
      const bufferConcatenated = Buffer.concat(buffer);
      const base64String = bufferConcatenated.toString('base64');

      console.log(downloadStream.contentType)
      const imgSrcString = `data:${downloadStream.contentType};base64,${base64String}`;
      req.session.avt = imgSrcString
      
      return next()
    });
    
    

  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: error.message,
    });
  } 
  
}

module.exports = {
  getImage,
};
