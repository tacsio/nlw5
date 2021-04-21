import axios from "axios";

const api = axios.create({
  baseURL: "https://my-json-server.typicode.com/tacsio/nlw5",
});

export default api;
