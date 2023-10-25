export default class UserRepository {
    constructor(dao){
        this.dao = dao
    }
    findUserById = async(data) => await this.dao.findUserById(data)
    getUsers = async() => this.dao.getUsers()
    deleteUser = async(id) => await this.dao.deleteUser(id)
}