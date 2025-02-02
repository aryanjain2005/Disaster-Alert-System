import axios from "axios";

const baseUrl = "/api/proxy";
//http://127.0.0.1:8079
//http://14.139.34.101:8079
//"http://10.8.1.10:8079"
export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});
