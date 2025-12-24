// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Calendar, X, Users, Phone } from "lucide-react";
// import api from "../services/app";
// import toast from "react-hot-toast";

// const MyTableBookings = () => {
//     const [open, setOpen] = useState(false);
//     const [bookings, setBookings] = useState([]);

//     const getBookings = async () => {
//         try {
//             const { data } = await api.get("/api/table-bookings/my-bookings");
//             if (data.success) {
//                 setBookings(data.bookings);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     const cancelBooking = async (bookingId) => {
//         try {
//             const confirm = window.confirm("Cancel this booking?");
//             if (!confirm) return;

//             const { data } = await api.delete(`/api/booking/delete/${bookingId}`);

//             if (data.success) {
//                 toast.success("Booking cancelled");

//                 setBookings(prev =>
//                     prev.map(b =>
//                         b._id === bookingId
//                             ? { ...b, status: "Cancelled" }
//                             : b
//                     )
//                 );
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     useEffect(() => {
//         if (open) getBookings();
//     }, [open]);

//     return (
//         <>
//             {/* Floating Button */}
//             {/* <motion.button
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 1.2, type: "spring" }}
//                 onClick={() => setOpen(true)}
//                 className="fixed bottom-48 right-6 z-50 w-16 h-16 bg-sky-500 text-white rounded-full shadow-lg flex items-center justify-center"
//             >
//                 <Calendar />
//             </motion.button> */}

//             {/* Modal */}
//             <AnimatePresence>
//                 {open && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
//                         onClick={() => setOpen(false)}
//                     >
//                         <motion.div
//                             initial={{ y: 100, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             exit={{ y: 100, opacity: 0 }}
//                             onClick={(e) => e.stopPropagation()}
//                             className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-sm sm:rounded-3xl shadow-2xl"
//                         >
//                             {/* Header */}
//                             <div className="sticky top-0 bg-white border-b-2 border-orange-400 p-5 flex justify-between items-center">
//                                 <h3 className="text-xl font-bold">My Tables</h3>
//                                 <button
//                                     onClick={() => setOpen(false)}
//                                     className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center"
//                                 >
//                                     <X />
//                                 </button>
//                             </div>

//                             {/* Content */}
//                             <div className="p-5 space-y-4">
//                                 {bookings.length === 0 ? (
//                                     <p className="text-center text-gray-500">
//                                         No table bookings yet 🍽️
//                                     </p>
//                                 ) : (
//                                     bookings.map(booking => (
//                                         <div
//                                             key={booking._id}
//                                             className="border border-gray-300 rounded-xl p-4"
//                                         >
//                                             <div className="flex justify-between mb-2">
//                                                 <p className="font-semibold">
//                                                     Booking #{booking._id.slice(-6)}
//                                                 </p>
//                                                 <span className={`text-sm font-medium ${booking.status === "Cancelled"
//                                                     ? "text-red-500"
//                                                     : "text-green-600"
//                                                     }`}>
//                                                     {booking.status}
//                                                 </span>
//                                             </div>

//                                             <p className="text-xs text-gray-500 mb-2">
//                                                 {new Date(booking.bookingTime).toLocaleString()}
//                                             </p>

//                                             <div className="flex items-center gap-2 text-sm mb-1">
//                                                 <Users size={14} />
//                                                 Guests: {booking.numberOfGuests}
//                                             </div>

//                                             <div className="flex items-center gap-2 text-sm mb-1">
//                                                 <Phone size={14} />
//                                                 {booking.contactNumber}
//                                             </div>

//                                             <p className="text-sm font-medium">
//                                                 Name: {booking.name}
//                                             </p>

//                                             {booking.status === "Confirmed" && (
//                                                 <button
//                                                     onClick={() => cancelBooking(booking._id)}
//                                                     className="mt-3 w-full py-2 text-sm font-semibold text-orange-500 border-2 border-orange-400 rounded-lg hover:bg-orange-50"
//                                                 >
//                                                     Cancel Booking
//                                                 </button>
//                                             )}
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </>
//     );
// };

// export default MyTableBookings;


import { useEffect, useState } from "react";
import { Calendar, Users, Phone } from "lucide-react";
import api from "../services/app";
import toast from "react-hot-toast";

const MyTableBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBookings = async () => {
        try {
            const { data } = await api.get("/api/table-bookings/my-bookings");
            console.log(data)
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (bookingId) => {
        try {
            const confirmCancel = window.confirm(
                "Cancel this booking?"
            );
            if (!confirmCancel) return;

            const { data } = await api.delete(
                `/api/booking/delete/${bookingId}`
            );

            if (data.success) {
                toast.success("Booking cancelled");
                setBookings(prev =>
                    prev.map(b =>
                        b._id === bookingId
                            ? { ...b, status: "Cancelled" }
                            : b
                    )
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getBookings();
    }, []);

    return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Header */}
            {/* <div className="flex items-center gap-2">
                <Calendar className="text-orange-500" />
                <h3 className="text-xl font-bold">My Table Bookings</h3>
            </div> */}

            {loading ? (
                <p className="text-center text-gray-500">
                    Loading bookings...
                </p>
            ) : bookings.length === 0 ? (
                <p className="text-center text-gray-500">
                    No table bookings yet 🍽️
                </p>
            ) : (
                bookings.map(booking => (
                    <div
                        key={booking._id}
                        className="border border-gray-300 rounded-xl p-4 space-y-2"
                    >
                        {/* Header */}
                        <div className="flex justify-between">
                            <p className="font-semibold">
                                Booking #{booking._id.slice(-6)}
                            </p>
                            <span
                                className={`text-sm font-medium ${booking.status === "Cancelled"
                                    ? "text-red-500"
                                    : "text-green-600"
                                    }`}
                            >
                                {booking.status}
                            </span>
                        </div>

                        <p className="text-xs text-gray-500">
                            {new Date(
                                booking.bookingTime
                            ).toLocaleString()}
                        </p>

                        {/* Details */}
                        <div className="flex items-center gap-2 text-sm">
                            <Users size={14} />
                            Guests: {booking.numberOfGuests}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Phone size={14} />
                            {booking.contactNumber}
                        </div>

                        <p className="text-sm font-medium">
                            Name: {booking.name}
                        </p>

                        {/* Cancel */}
                        {booking.status === "Confirmed" && (
                            <button
                                onClick={() =>
                                    cancelBooking(booking._id)
                                }
                                className="w-full mt-2 py-2 text-sm font-semibold 
                                text-orange-500 border-2 border-orange-400 
                                rounded-lg hover:bg-orange-50"
                            >
                                Cancel Booking
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default MyTableBookings;

