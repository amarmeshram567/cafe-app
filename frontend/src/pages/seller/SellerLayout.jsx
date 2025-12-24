import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CircleIcon, CirclePlusIcon, ClipboardCheckIcon, ListIcon, TableIcon } from "lucide-react"
import api from '../../services/app';
import { toast } from "react-hot-toast"



const SellerLayout = () => {

    const navigate = useNavigate()

    const sidebarLinks = [
        { name: "Add Menu", path: "/seller", icon: <CirclePlusIcon /> },
        { name: "Menu List", path: "/seller/menu-list", icon: <ListIcon /> },
        { name: "Orders", path: "/seller/orders", icon: <ClipboardCheckIcon /> },
        { name: "Table Bookings", path: "/seller/table-bookings", icon: <TableIcon /> },
    ]

    const logout = async () => {
        try {
            const { data } = await api.get('/api/seller/logout')
            if (data.success) {
                toast.success(data.message)
                navigate('/')
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <>

            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300  bg-white">

                <Link className='py-4 px-1 ' to='/'>
                    <p className='cursor-pointer text-xl text-orange-600  font-semibold'> Brew & Co.</p>
                </Link>

                <div className="flex items-center gap-5 text-gray-500">
                    <p className='text-orange-500'>Hi! Admin</p>
                    <button
                        onClick={logout}
                        className='border border-orange-300 text-orange-500 hover:border-orange-500 hover:text-orange-600 duration-200 rounded-full text-sm px-4 py-1'
                    >
                        Logout

                    </button>
                </div>
            </div>

            <div className="flex">
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
                    {sidebarLinks.map((item) => (
                        <NavLink
                            to={item.path}
                            key={item.name}
                            end={item.path === '/seller'}
                            className={({ isActive }) => `flex items-center py-3 px-4 gap-3
                                ${isActive ? "border-r-4 md:border-r-[6px] bg-white border-orange-500 text-orange-400" : "hover:bg-gray-100/90 border-white"}
                            `}
                        >

                            <p className='w-7 h-7'>{item.icon}</p>
                            <p className="md:block hidden text-center">
                                {item.name}
                            </p>

                        </NavLink>
                    ))}
                </div>


                <Outlet />


            </div>

        </>
    );
}

export default SellerLayout;
