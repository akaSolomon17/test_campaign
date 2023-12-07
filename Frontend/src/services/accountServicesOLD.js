import api from "../api/axios";

class AccountServices {
  //Call request API login by method POST
  async userLogin(data) {
    return await api.post("/api/login", data, { withCredentials: true });
  }

  async getAccessToken(data) {
    return await api.post("/api/refresh_token", data, {
      withCredentials: true,
    });
  }

  async getAllAccount(data) {
    return await api.get("/api/all_user_info", data, { withCredentials: true });
  }

  async postNewAccount(data, token) {
    return await api.post("/api/add_user", data, {
      withCredentials: true,
      headers: { Authorization: token },
    });
  }

  async searchAccount(data) {
    return await api.get("/api/user_info", data);
  }

  async updateAccount(data, token) {
    return await api.put("/api/update_user", data, {
      withCredentials: true,
      headers: { Authorization: token },
    });
  }

  async deleteAccount(data) {
    return await api.delete("/api/delete_user", data);
  }

  async deleteAllAccount(data) {
    return await api.delete("/api/delete_all_user", data);
  }
}

export default new AccountServices();
