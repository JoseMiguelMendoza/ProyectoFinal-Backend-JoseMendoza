import logger from "../utils/logger.js";
import { CartService, UserService } from "../services/index.js";
import UserDTO from '../dto/Users.js'
import nodemailer from 'nodemailer'

export const getAllUsers = async(req, res) => {
    logger.http('Someone made a GET request to the endpoint /api/carts')
    let allUsers = await UserService.getUsers()
    let usersWithDTO = allUsers.map(user => new UserDTO(user))
    return res.status(200).json({ status: 'success', payload: usersWithDTO })
}

export const deleteUsersWithTwoDaysOfInactivity = async(req, res) => {
    let allUsers = await UserService.getUsers()
    const currentDate = new Date();
    const inactivityPeriod = 2 * 24 * 60 * 60 * 1000
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_NODEMAILER_USER,
            pass: process.env.GMAIL_NODEMAILER_PASSWORD
        }
    })

    const inactiveUsers = [];

    for(const user of allUsers){
        const lastConnection = user.lastConnection
        if(user.role === 'Usuario/a'){
            if(lastConnection && currentDate - lastConnection >= inactivityPeriod){
                inactiveUsers.push(user)
                console.log(user.email)
                const mailOptions = {
                    from: process.env.GMAIL_NODEMAILER_USER,
                    to: user.email,
                    subject: 'Cuenta eliminada por inactividad',
                    html: 'Tu cuenta ha superado la inactividad de 2 días'
                }

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        logger.error('Error al enviar el correo electrónico de notificación: ', err);
                    } else {
                        logger.info('Correo electrónico de notificación enviado');
                    }
                })
            }
        }
    }

    for (const userToDelete of inactiveUsers){
        let user = await UserService.findUserById(userToDelete._id)
        const cartId = user.cart
        await CartService.deleteCart(cartId)
        await UserService.deleteUser(userToDelete._id)
    }
    return res.status(200).json({ status: 'success', message: 'Usuarios inactivos notificados y eliminados de la base de datos.'})
    
}

export const deleteUserController = async(req, res) => {
    let user_id = req.params.id
    let user = await UserService.findUserById(user_id)
    const cartId = user.cart
    await UserService.deleteUser(user_id)
    await CartService.deleteCart(cartId)
    return res.status(200).json({ status: 'success', message: 'User deleted.'})
}