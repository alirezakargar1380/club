const _ = require('lodash');
const log = require('../utils/log.utility');
const {
    Mail
} = require('../models');
const {
    Op
} = require('sequelize')
const moment = require('moment');
const Exception = require('../utils/error.utility');
var mailer = require("nodemailer");

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport({
    service: "gmail",
    auth: {
        user: "mohsentelgerdy@gmail.com",
        pass: "AAaa1370"
    }
});

async function index() {
    try {
        const mail = await Mail.findAll({
            // where: {
            //     runDate: {
            //       [Op.lte]: moment().format('YYYY-MM-DD')
            //     },
            //     runTime: {
            //       [Op.eq]: moment().format('HH:mm:ss')
            //     },
            //   }
        })

        return mail;
    } catch (error) {
        log.error(error);
        throw Exception.setError(error, false);
    }
}

async function getMailList() {
    try {
        const mail = await Mail.findAll({
            where: {
                runDate: {
                    [Op.lte]: moment().format('YYYY-MM-DD')
                },
                runTime: {
                    [Op.eq]: moment().format('HH:mm:ss')
                },
            }
        })

        return mail;
    } catch (error) {
        log.error(error);
        throw Exception.setError(error, false);
    }
}


async function create(mails, userId) {
    try {
        for (const mail of mails.emails)
            await Mail.create({
                subject: mails.subject,
                text: mails.text,
                email: mail,
                userId: userId,
                runDate: mails.runDate,
                runTime: mails.runTime,
                sended : false
            })

        return true;
    } catch (error) {
        log.error(error);
        throw Exception.setError(error, false);
    }
}

async function update(id, newMail) {
    try {
        const mail = await Mail.findByPk(id)

        if (!mail) {
            throw Exception.setError("این آیتم موجود نمیباشد", true);
        }

        await mail.update({
            ...mail, //spread out existing task
            ...newMail //spread out body - the differences in the body will over ride the task returned from DB.
        })


        return true;
    } catch (error) {
        log.error(error);
        throw Exception.setError(error, false);
    }
}

async function send(arrayList) {
    try {
        let emailPromiseArray = [];

        //prepare the email for each receiver
        for (let i = 0; i < arrayList.length; i++) {
            emailPromiseArray.push(
                sendMail({
                    from: "mohsentelgerdy@gmail.com",
                    to: arrayList[i].email,
                    subject: arrayList[i].subject,
                    text: arrayList[i].text
                })
            )
        }

        //run the promise
        Promise.all(emailPromiseArray).then(async (result) => {
            // console.log('all mail completed');
            for (let i = 0; i < arrayList.length; i++)
                await update(arrayList[i].id, {
                    sended: true
                })

            return result;
        }).catch((error) => {
            // console.log(error);
            throw Exception.setError(error, false);
        })
    } catch (error) {
        log.error(error);
        throw Exception.setError(error, false);
    }
}



function sendMail(mail) {

    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mail, function (error, response) {
            if (error) {
                // console.log(error);
                reject(error);
            } else {
                // console.log("Message sent: " + JSON.stringify(response));
                resolve(response);
            }

            smtpTransport.close();
        });
    })
}



module.exports = {
    index,
    send,
    create,
    getMailList,
    update
}