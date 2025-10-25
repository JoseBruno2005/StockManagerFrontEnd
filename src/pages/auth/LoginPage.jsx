import { Form, Formik, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";

export default function Login() {

    const {loginContext} = useAuth();
    const navigate = useNavigate();



    return (
        <div>
            <h1>Cadastre-se</h1>

            <div>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    onSubmit={async (values) => {
                        try {
                            await loginContext(values.email, values.password);
                            return navigate("/home")
                        } catch (error) {
                            console.log(error)
                        }
                    }}
                >
                    <Form>
                        <div>
                            <label>Email</label>
                            <div className="relative">
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Digite seu email"
                                />
                            </div>
                        </div>
                        <div>
                            <label>Senha</label>
                            <div className="relative">
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Digite sua senha"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                        >
                            Login
                        </button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}