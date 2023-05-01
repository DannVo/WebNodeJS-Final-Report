const {MongoClient, GridFSBucket } = require('mongodb')
const { ObjectId } = require('bson');
const mongoose = require('mongoose')
const url = 'mongodb+srv://anthonyvo:AnthonyVo378@test.csv7oin.mongodb.net/test?retryWrites=true&w=majority'
const client = new MongoClient(url, { useUnifiedTopology: true })
const mongodb = require('mongodb')
const Grid = require('gridfs-stream')
const fs = require('fs')
const {fileIcons, byte2Size} = require('../support/fileConvert');
const { ObjectID } = require('mongodb');

const conn = mongoose.createConnection(url);
let gfs
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('george.mail.files')
})
async function getAllFiles(email, idFile) {
    try{
        //idFile: list of id file
        //connect to files connection
        await client.connect()
        const db = client.db('test')
        const username = email.substring(0, email.indexOf("@"))
        const bucket = new GridFSBucket(db, {bucketName: `${username.toString()}.mail`})
        const listFiles = []

        for (const idElement of idFile) {
            const list = await bucket.find({_id: idElement})
            // console.log(list)
            await list.forEach(doc => {
                let contType = (doc.filename).substring((doc.filename).indexOf("."), (doc.filename).length)
                console.log("Type: ",contType)
                let icon = fileIcons[contType]
                if(icon === null ||icon === ""){
                    icon = '<i class="fas fa-file-alt"></i>'
                }
                listFiles.push({
                    id: (doc._id).toString(),
                    icon: icon,
                    name: doc.filename,
                    size: byte2Size(doc.length)
                })
                console.log(listFiles)
                
            })
            
        }
        console.log(listFiles)
        return await listFiles
        
    } catch (error) {
        console.log(error)
        return false
    }

}

async function getBucket(email) {
    
    await client.connect()
    const db = client.db('test')
    const username = email.substring(0, email.indexOf("@"))
    const bucket = new GridFSBucket(db, {bucketName: `${username.toString()}.mail`})
    
    return bucket
    
}

async function getFileBucket(email, fileID, res) {
    const bucket = await getBucket(email)
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileID))
    console.log(downloadStream)
    downloadStream.pipe(res)
}

async function dowloadFileBucket(email, fileID, res) {
    try {
        const bucket = await getBucket(email)
        bucket.find({ _id: new ObjectId(fileID) }).toArray((err, file) => {
        const objectId = ObjectID.createFromHexString(fileID);
        const downloadStream = bucket.openDownloadStream(objectId);
        const filename = file[0].filename

        res.set({
            'Content-Type': downloadStream.s.contentType,
            'Content-Disposition': 'attachment',
            'Content-Length': downloadStream.s.length,
            'Content-Disposition': `attachment; filename="${filename}"`,
        });

        downloadStream.pipe(res);

        downloadStream.on('error', (err) => {
            console.error(err);
        });

        downloadStream.on('end', () => {
            console.log('File downloaded successfully');
        });
    })
    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid Report ID');
    }
}
module.exports = {
    getAllFiles, getBucket, getFileBucket, dowloadFileBucket
}