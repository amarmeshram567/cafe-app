import { useEffect, useState } from "react";
import api from "../../services/app";
import toast from "react-hot-toast";

const statusOptions = ["Pending", "Confirmed", "Cancelled", "Completed"];

const TableBookingLists = () => {
    const [bookings, setBookings] = useState([]);


    const statusStyles = {
        Pending: "bg-gray-100 text-gray-800 font-semibold border border-gray-300",
        Confirmed: "bg-green-100 text-green-800 font-semibold border border-gray-300",
        Cancelled: "bg-red-100 text-red-800 font-semibold border border-gray-300",
        Completed: "bg-blue-100 text-blue-800 font-semibold border border-gray-300",
    };

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/api/table-bookings/all')
            if (data.success) {
                setBookings(data.bookings)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        fetchBookings()
    }, [])


    const updateStatus = async (bookingId, status) => {
        try {
            const { data } = await api.patch(`/api/table-bookings/${bookingId}/status`, { status })
            if (data.success) {
                setBookings(prev =>
                    prev.map(tb =>
                        tb._id === bookingId ? { ...tb, status } : tb
                    )
                );
                toast.success("Booking status updated")
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    return (
        <div className="flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">
                    Table Bookings
                </h2>

                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Customer</th>
                                <th className="px-4 py-3 font-semibold truncate">Table</th>
                                <th className="px-4 py-3 font-semibold truncate">Guests</th>
                                <th className="px-4 py-3 font-semibold truncate">Time</th>
                                <th className="px-4 py-3 font-semibold truncate">Contact</th>
                                <th className="px-4 py-3 font-semibold truncate">Status</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm text-gray-500">
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="border-t border-gray-500/20">
                                    <td className="px-4 py-3 uppercase">{booking.user?.name || booking.name}</td>
                                    <td className="px-4 py-3">{booking.tableNumber}</td>
                                    <td className="px-4 py-3">{booking.numberOfGuests}</td>
                                    <td className="px-4 py-3">
                                        {new Date(booking.bookingTime).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">{booking.contactNumber}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={booking.status}
                                            disable={['Cancelled', "Completed"].includes(booking.status)}
                                            onChange={(e) =>
                                                updateStatus(booking._id, e.target.value)
                                            }
                                            className={`rounded px-2 py-1 outline-none ${statusStyles[booking.status]}`}
                                        >
                                            {statusOptions.map((status) => (
                                                <option className="bg-gray-50" key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableBookingLists;
