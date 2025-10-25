import { api } from "../Api";

export default async function RegisterUserService(userDTO) {
    try{
        const res = await api.post('/user/save', {
            name: userDTO.name,
            email: userDTO.email,
            password: userDTO.password
        })

        return res;
    }catch(error){
        throw error.res;
    }
}