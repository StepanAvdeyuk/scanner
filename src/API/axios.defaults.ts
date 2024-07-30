import axios from "axios";
import { BASE_URL, API_TOKEN } from "./consts";

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Authorization'] = `Token ${API_TOKEN}`;
axios.defaults.headers.common['accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';