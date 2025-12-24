import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../services/app';
import toast from 'react-hot-toast';

const MenusList = () => {

    const { menus, fetchMenus } = useAppContext()

    console.log(menus)

    const toggleStock = async (id, isAvailable) => {
        try {
            const { data } = await api.post("/api/menu/change-availability", { id, isAvailable });
            if (data.success) {
                fetchMenus();
                toast.success(data.message)
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
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Menu</h2>

                {
                    menus.length > 0 ? (
                        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                            <table className="md:table-auto table-fixed w-full overflow-hidden">
                                <thead className='text-gray-900 text-sm text-left'>
                                    <tr>
                                        <th className="px-4 py-3 font-semibold truncate">Menu</th>
                                        <th className="px-4 py-3 font-semibold truncate">Category</th>
                                        <th className="px-4 py-3 font-semibold truncate">Price</th>
                                        <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm text-gray-500'>
                                    {menus.map((menu) => (
                                        <tr key={menu.id} className='border-t border-gray-500/20'>
                                            <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                                                <div className="border border-gray-300 rounded p-2">
                                                    <img src={menu.imageUrl} alt="menu" className='w-16' />
                                                </div>
                                                <span className='truncate max-sm:hidden w-full'>{menu.name}</span>
                                            </td>
                                            <td className='px-4 py-3'>{menu.category}</td>
                                            <td className='px-4 py-3 max-sm:hidden'>${menu.price}</td>
                                            <td className="px-4 py-3">
                                                <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                                                    <input
                                                        type="checkbox"
                                                        onClick={() => toggleStock(menu._id, !menu.isAvailable)}
                                                        checked={menu.isAvailable}
                                                        className='sr-only peer'
                                                    />
                                                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-orange-600 transition-colors duration-200"></div>
                                                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='flex items-center justify-center'>
                            <h1 className='text-3xl font-semibold text-gray-800'>Menu not found</h1>
                        </div>
                    )
                }

            </div>
        </div>
    );
}

export default MenusList;
