import { useEffect, useState } from "react"
import api from "../../services/app";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



const SellerLogin = () => {

    const { isSeller, setIsSeller } = useAppContext()

    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            const { data } = await api.post('/api/seller/login', { email, password })
            if (data.success) {
                setIsSeller(true)
                navigate('/seller')

                toast.success("Logged In")

            }
            else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (isSeller) {
            navigate("/seller")
        }
    }, [isSeller])


    return !isSeller && (
        <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center text-sm text-gray-600">
            <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-orange-500">Seller</span> Login
                </p>

                <div className="w-full">
                    <p>Email</p>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="seller email"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-orange-300"
                        required
                    />
                </div>

                <div className="w-full">
                    <p>Password</p>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="seller password"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-orange-300"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded-md cursor-pointer text-center"
                >
                    Login
                </button>

            </div>
        </form>
    )
}


export default SellerLogin