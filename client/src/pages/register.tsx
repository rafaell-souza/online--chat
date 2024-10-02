import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { ImSpinner9 } from "react-icons/im";
import useFormData from "../hooks/useFormData";
import registerSchema from "../schemas/Register";
import IRegister from "../interfaces/IRegister";
import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

import { useState } from "react";

const Register = () => {
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });

    const {
        loading,
        register,
        errors,
        handleSubmitForm,
        statusCode
    } = useFormData<IRegister>(registerSchema, "http://localhost:9000/api/register");

    return (
        <section className="h-screen w-full flex justify-center items-center">
            <form onSubmit={handleSubmitForm} className="w-56 rounded-lg flex flex-col">

                <h1 className="text-gray-400 font-bold mb-4 text-2xl">Register</h1>

                <div className="flex flex-col w-full">
                    <input
                        className={`text-sm h-6 text-gray-400 px-1 bg-gray-900 rounded outline-none ${errors.name ? "border-red-900 border placeholder:text-red-500" : ""}`}
                        type="text" placeholder="Name" 
                        {...register("name")}
                    />
                    {
                        errors.name && <span className="text-red-500 flex items-center gap-x-1 text-[10px]">{
                            <MdErrorOutline className="text-red-500" />}{
                            errors.name.message
                        }</span>
                    }
                </div>

                <div className="flex flex-col w-full mt-2">
                    <input
                        className={`text-sm h-6 text-gray-400 px-1 bg-gray-900 rounded outline-none ${errors.email ? "border-red-900 border placeholder:text-red-500" : ""}`}
                        type="email" placeholder="Email" 
                        {...register("email")}
                    />
                    {
                        statusCode === 409 ? <span className="text-red-500 flex items-center gap-x-1 text-[10px]">
                            <MdErrorOutline className="text-red-500" />
                            <span >Email already exists </span>
                            </span>

                        : errors.email && <span className="text-red-500 flex items-center gap-x-1 text-[10px]">
                            <MdErrorOutline className="text-red-500" />
                            {errors.email.message}
                        </span>
                    }
                </div>

                <div className="flex flex-col w-full mt-2 relative">
                    <input
                        className={`text-sm h-6 text-gray-400 pl-1 pr-7 bg-gray-900 rounded outline-none ${errors.password ? "border-red-900 border placeholder:text-red-500" : ""}`}
                        type={showPassword.password ? "text" : "password"}
                        placeholder="Password"
                        {...register("password")}
                    />

                    <div
                        className="absolute right-2 top-1"
                        onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}>
                        {showPassword.password ? <BsEyeSlashFill className="text-gray-400" /> : <IoEyeSharp className="text-gray-400" />}
                    </div>
                    {
                        errors.password && <span className="text-red-500 flex gap-x-1 items-center text-[10px]">
                            <MdErrorOutline className="text-red-500" />
                            {errors.password.message}
                        </span>
                    }
                </div>

                <div className="flex flex-col w-full mt-2 relative">
                    <input
                        className={ `text-sm h-6 text-gray-400 px-1 bg-gray-900 rounded outline-none ${errors.confirmPassword ? "border-red-900 border placeholder:text-red-500" : ""}` }
                        type={showPassword.confirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...register("confirmPassword")}
                    />

                    <div
                        className="absolute right-2 top-1"
                        onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}>
                        {showPassword.confirmPassword ? <BsEyeSlashFill className="text-gray-400" /> : <IoEyeSharp className="text-gray-400" />}
                    </div>
                    {
                        errors.confirmPassword && <span className="text-red-500 flex gap-x-1 items-center text-[10px]">
                            <MdErrorOutline className="text-red-500" />
                            {errors.confirmPassword.message}
                        </span>
                    }
                </div>

                <button 
                className="bg-blue-900 flex hover:bg-blue-950 justify-center text-white mt-4 h-8 items-center rounded">
                    {
                        loading ? <ImSpinner9 className="animate-spin" /> : "Register"
                    }
                </button>
                <p className="text-gray-400 text-xs mt-2 flex justify-center">Already have an account? <Link to="/login" className="text-blue-500 ml-1 hover:text-blue-700">Login</Link></p>

            </form>
        </section>
    )
}

export default Register;