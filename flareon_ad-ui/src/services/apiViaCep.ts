import axios from "axios";


export const apiViaCEP = axios.create({
    baseURL: 'https://viacep.com.br/ws/'
})