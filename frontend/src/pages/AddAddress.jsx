import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import api from '../services/app';
import toast from 'react-hot-toast';

const heroImage = "https://images.pexels.com/photos/9789495/pexels-photo-9789495.jpeg";

const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input
        className='w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-800 bg-white focus:ring-2 focus:ring-amber-400 placeholder-gray-400 transition'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        value={address[name]}
        required
        name={name}
    />
);

const AddAddress = () => {
    const { user } = useAppContext();

    const [address, setAddress] = useState({
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        phone: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/address/create', { address });
            if (data.success) {
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='relative min-h-screen bg-gray-50 py-16 px-4 md:px-16'>
            {/* Background Hero Image */}
            <div className="absolute inset-0 z-10">
                <img
                    src={heroImage}
                    className="w-full h-full object-cover"
                    alt="Hero Background"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-brown-900/70 to-black/90" />
            </div>

            {/* Caption / Title over Hero */}
            <div className="relative z-10 text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Add Your <span className="text-amber-400">Shipping Address</span>
                </h1>
                <p className="mt-3 text-white/80 text-lg">
                    Fill in the details below to save your shipping address.
                </p>
            </div>

            {/* Form */}
            <div className="relative z-10 flex justify-center">
                <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-gray-800 shadow-xl border border-gray-200">
                    <form onSubmit={onSubmitHandler} className="space-y-5 text-sm">
                        <InputField
                            handleChange={handleChange}
                            address={address}
                            name="email"
                            type="email"
                            placeholder="Email address"
                        />

                        <InputField
                            handleChange={handleChange}
                            address={address}
                            name="street"
                            type="text"
                            placeholder="Street"
                        />

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="city"
                                type="text"
                                placeholder="City"
                            />
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="state"
                                type="text"
                                placeholder="State"
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="zipcode"
                                type="text"
                                placeholder="Zip code"
                            />
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="phone"
                                type="text"
                                placeholder="Phone"
                            />
                        </div>

                        <button className='w-full mt-4 bg-amber-500 text-white py-3 hover:bg-amber-600 duration-500 transition-all font-semibold uppercase rounded-xl shadow-lg'>
                            Save Address
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAddress;
