import axios from "axios";

const baseUrl = "https://smart-parking-gold.vercel.app/api/proxy";
//http://127.0.0.1:8079
//http://14.139.34.101:8079
//"http://10.8.1.10:8079"
//"/api/proxy"
export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});
