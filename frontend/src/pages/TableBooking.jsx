import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, Phone, Mail, Check } from "lucide-react";
import api from "../services/app";
import { toast } from "react-hot-toast"

const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
];

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

const TableBooking = () => {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        date: "",
        time: "",
        guests: 2,
        name: "",
        phone: "",
        email: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const bookingDateTime = new Date(
                `${formData.date} ${formData.time}`
            );

            const payload = {
                tableNumber: 1,
                bookingTime: bookingDateTime,
                numberOfGuests: formData.guests,
                name: formData.name,
                contactNumber: formData.phone
            }

            const { data } = await api.post('/api/table-bookings/create', payload)

            if (data.success) {
                toast.success("Table booked successfully")
                setIsSubmitted(true)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
        finally {
            setLoading(false)
        }
    };

    const isStep1Complete = formData.date && formData.time && formData.guests;
    const isStep2Complete = formData.name && formData.phone && formData.email;

    /* ✅ Success Screen */
    if (isSubmitted) {
        return (
            <section id="table-bookings" className="py-20 bg-[hsl(30_25%_96%)]">
                <div className="max-w-md mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-10 shadow-lg text-center"
                    >
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-orange-500" />
                        </div>

                        <h3 className="text-3xl font-bold mb-3">Booking Confirmed!</h3>
                        <p className="text-gray-600 mb-6">
                            Table for {formData.guests} on {formData.date} at {formData.time}
                        </p>

                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setStep(1);
                                setFormData({
                                    date: "",
                                    time: "",
                                    guests: 2,
                                    name: "",
                                    phone: "",
                                    email: "",
                                });
                            }}
                            className="px-6 py-3 border rounded-full bg-orange-500 text-white hover:bg-orange-600"
                        >
                            Book Another Table
                        </button>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="table-bookings" className="py-20 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-orange-500 font-semibold uppercase text-sm">
                        Reservations
                    </span>
                    <h2 className="text-4xl font-bold mt-2 mb-4">Book Your Table</h2>
                    <p className="text-gray-600">
                        Reserve your spot and enjoy a cozy café experience.
                    </p>
                </div>

                {/* Progress */}
                <div className="flex justify-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? "bg-orange-500 text-white" : "bg-gray-200"}`}>
                            1
                        </div>
                        <div className={`w-20 h-1 ${step >= 2 ? "bg-orange-500" : "bg-gray-200"}`} />
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? "bg-orange-500 text-white" : "bg-gray-200"}`}>
                            2
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {/* STEP 1 */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white rounded-3xl p-8 shadow-lg"
                            >
                                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                    <Calendar className="text-orange-500" />
                                    Date & Time
                                </h3>

                                {/* Date */}
                                <label className="block mb-2 font-medium">Date</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full p-3 border border-gray-300 outline-orange-500 rounded-lg mb-6"
                                />

                                {/* Time */}
                                <label className="block mb-2 font-medium flex items-center gap-2">
                                    <Clock size={16} /> Time
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, time })}
                                            className={`py-2 rounded-lg ${formData.time === time
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-100"
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>

                                {/* Guests */}
                                <label className="block mb-2 font-medium flex items-center gap-2">
                                    <Users size={16} /> Guests
                                </label>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {guestOptions.map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, guests: num })}
                                            className={`w-12 h-12 rounded-lg ${formData.guests === num
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-100"
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    disabled={!isStep1Complete}
                                    onClick={() => setStep(2)}
                                    className="w-full py-3 bg-orange-500 text-white rounded-full disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-3xl p-8 shadow-lg"
                            >
                                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                    <Phone className="text-orange-500" />
                                    Your Details
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border border-gray-300 outline-orange-500 rounded-lg mb-4"
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-3 border border-gray-300 outline-orange-500 rounded-lg mb-4"
                                />

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 border border-gray-300 outline-orange-500 rounded-lg mb-6"
                                />

                                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                                    <p className="text-sm text-gray-500">Booking Summary</p>
                                    <p className="font-medium">
                                        {formData.guests} guests • {formData.date} • {formData.time}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 border rounded-full"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!isStep2Complete || loading}
                                        className="flex-1 py-3 bg-orange-500 text-white rounded-full disabled:opacity-50"
                                    >
                                        {loading ? "Booking..." : "Confirm Booking"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </section>
    );
};

export default TableBooking;
