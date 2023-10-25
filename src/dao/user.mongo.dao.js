import userModel from '../models/user.model.js'

export default class UserDAO {
    findUserById = async(data) => await userModel.findById(data)
    getUsers = async() => await userModel.find().lean().exec()
    deleteUser = async(id) => await userModel.findByIdAndDelete(id)
}