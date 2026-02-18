const {UploadClient}=require('@uploadcare/upload-client')

const client=new UploadClient({
    publicKey:process.env.PUBLICKEY_UPLOUADCARE
})

module.exports = client;