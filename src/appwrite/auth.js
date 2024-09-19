import conf from '../conf/conf'
import { Client, Account, ID } from "appwrite";

class AuthService {

    client = new Client()
    account;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) return this.login({ email, password })
            else return userAccount
        } catch (error) {
            console.error("Appwrite service :: createAccount", error);
        }
    }
    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Appwrite service :: login", error);
        }
    }
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser", error);
        }
        return null
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite service :: logout", error);
        }
    }

   // Update Current User (name, email, password)
   async updateCurrentUser(data) {
    try {
      const updatedUser = await this.account.updatePrefs(data);
      return updatedUser;
    } catch (error) {
      console.error("Appwrite service :: updateCurrentUser", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService
