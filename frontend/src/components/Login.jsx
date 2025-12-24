import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../services/app';
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';

const Login = () => {

    const { setShowUserLogin, setUser } = useAppContext()
    const navigate = useNavigate()

    const [state, setState] = useState("login");
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("")

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()

            const { data } = await api.post(`api/users/${state}`, {
                name, email, password
            })

            if (data.success) {
                navigate("/")
                setUser(data.user)
                setShowUserLogin(false)
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            )
        }
    }


    return (
        <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-sky-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-orange-600">User</span> {state === 'login' ? "Login" : "Sign Up"}
                </p>

                {
                    state === 'register' && (
                        <div className="w-full text-black font-semibold">
                            <p>Name</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                type='text'
                                placeholder='type here'
                                className='border border-gray-200 rounded w-full p-2 mt-1 outline-orange-500'
                                required
                            />
                        </div>
                    )
                }

                <div className="w-full text-black font-semibold">
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type='email'
                        placeholder='type here'
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-orange-500'
                        required
                    />
                </div>
                <div className="w-full text-black font-semibold">
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type='password'
                        placeholder='type here'
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-orange-500'
                        required
                    />
                </div>

                {
                    state === 'register' ? (
                        <p className='text-black'>Already have account? <span onClick={() => setState("login")} className='text-rose-700 cursor-pointer'>click here</span></p>
                    ) : (
                        <p className='text-black'>
                            Create an account? <span onClick={() => setState("register")} className='text-rose-700 cursor-pointer'>click here</span>
                        </p>
                    )
                }

                <button className='bg-orange-600 hover:bg-orange-500 transition-all text-white w-full py-2 rounded-md cursor-pointer'>
                    {state === 'register' ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
