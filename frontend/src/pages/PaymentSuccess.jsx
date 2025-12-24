import { useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/", {
            replace: true,
            state: { openPanel: "orders" }
        });

        toast.success("Order placed successfully");
    }, []);



    return <></>
};

export default PaymentSuccess;
