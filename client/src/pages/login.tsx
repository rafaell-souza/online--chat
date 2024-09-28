import useFormData from "../hooks/useFormData";
import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import loginSchema from "../schemas/login";
import { ImSpinner9 } from "react-icons/im";

type ILogin = {
    email: string;
    password: string;
}

const Login = () => {
    const {
        loading,
        register,
        errors,
        handleSubmitForm,
        statusCode
    } = useFormData<ILogin>(loginSchema, "http://localhost:9000/api/login");

    return (
        <section className="h-screen w-full flex justify-center items-center">
            <form onSubmit={handleSubmitForm} className="w-56 rounded-lg flex flex-col">

                <h1 className="text-gray-400 font-bold mb-4 text-2xl">Login</h1>

                <div className="flex flex-col w-full mt-2">
                    <input
                        className={`text-sm h-6 text-gray-400 px-1 bg-gray-900 rounded outline-none ${errors.email || errors.password || statusCode === 400 ? "border-red-900 border placeholder:text-red-500" : ""}`}
                        type="email" placeholder="Email" 
                        {...register("email")}
                    />
                </div>

                <div className="flex flex-col w-full mt-2 relative">
                    <input
                        className={`text-sm h-6 text-gray-400 pl-1 pr-7 bg-gray-900 rounded outline-none ${errors.password || errors.email || statusCode === 400 ? "border-red-900 border placeholder:text-red-500" : ""}`}
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                    />
                    {
                        (errors.email || errors.password || statusCode === 400) && <span className="text-red-500 flex gap-x-1 items-center text-[10px]">
                            <MdErrorOutline className="text-red-500" />
                            Email or password is incorrect
                        </span>
                    }
                </div>

                <button className="bg-blue-900 flex hover:bg-blue-950 justify-center text-white mt-4 h-8 items-center rounded">
                    {
                        loading ? <ImSpinner9 className="animate-spin" /> : "Login"
                    }
                </button>
                <p className="text-gray-400 text-xs mt-2 flex justify-center">Don't have an account? <Link to="/register" className="text-blue-500 ml-1 hover:text-blue-700">Register</Link></p>

            </form>
        </section>
    )
}

export default Login;