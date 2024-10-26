var nodemailer=require('nodemailer')

 var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'balprao@gmail.com',
      pass: 'itws nqyy bkjz hlla'
    }
  });
  
module.exports={transporter}