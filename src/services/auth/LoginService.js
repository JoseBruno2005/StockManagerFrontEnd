import { api } from "../Api";

export default async function LoginService(email, password) {
    try{
        const res = await api.post('/user/login', {
            email: email,
            password: password
        })
        
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}