import { config } from "@/config"
import Axios from "axios"

export const axios = Axios.create({
    baseURL: config.API_URL,
});