import React, { useState } from 'react';

import upload_area from "../../assets/upload_area.png";
import api from '../../services/app';
import toast from 'react-hot-toast';





const AddMenu = () => {

    const [image, setImage] = useState(null);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [loading, setLoading] = useState(false)


    const categoriesItems = [
        "All", "Coffee", "Pastry", "Brunch", "Dessert"
    ]


    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const menuData = {
                name,
                description: description.split('\n'),
                category,
                price
            }

            const formData = new FormData();
            formData.append('menuData', JSON.stringify(menuData));
            formData.append("image", image)


            const { data } = await api.post("/api/menu/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (data.success) {
                toast.success(data.message)
                setName("")
                setDescription("")
                setCategory("")
                setPrice("");
                setImage(null)
                setLoading(false)
            }
            else {
                toast.error(data.message)
            }


        } catch (error) {
            toast.error(error.message)
        }
    }



    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between'>
            <form onSubmit={onSubmitHandler} className='md:p-10 p-4 space-y-5 max-w-lg'>
                <div>
                    <p className="text-base font-medium">Menu Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">

                        <label htmlFor="menu-image">
                            <input
                                type="file"
                                id='menu-image'
                                accept='image/*'
                                hidden
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImage(e.target.files[0])
                                    }
                                }}
                            />
                            <img
                                src={image instanceof File ? URL.createObjectURL(image) : upload_area}
                                alt='upload'
                                className='max-w-50 object-cover cursor-pointer'
                            />
                        </label>

                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className='text-base font-medium' htmlFor='menu-name'>Menu Name</label>
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        id='menu-name'
                        placeholder='Type here'
                        className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40'
                        required
                    />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className='text-base font-medium' htmlFor='menu-description'>Menu Description</label>
                    <textarea
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        id='menu-description'
                        placeholder='Type here'
                        className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40'
                        required
                    />
                </div>

                <div className="w-full flex flex-col gap-1">
                    <label htmlFor="category" className='text-base font-medium'>Category</label>
                    <select
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        id='category'
                        className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40'
                    >
                        <option value="">Select Category</option>
                        {
                            categoriesItems.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="flex items-center gap-5 flex-wrap">

                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className='text-base font-medium' htmlFor="menu-price">Menu Price</label>
                        <input
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            id='menu-price'
                            type='number'
                            placeholder='0'
                            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40'
                            required
                        />
                    </div>
                </div>

                <button className='px-8 py-2.5 bg-orange-500 text-white cursor-pointer font-medium rounded'>
                    {loading ? "Adding..." : "Add"}
                </button>

            </form>
        </div>
    );
}

export default AddMenu;
