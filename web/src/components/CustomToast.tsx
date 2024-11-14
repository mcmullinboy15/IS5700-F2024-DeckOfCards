import { toast, ToastContainer, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast element for use on pages
const CustomToast = ({
  position = "top-right",
  autoClose = 3000,
}: {
  position?: ToastContainerProps["position"];
  autoClose?: number;
}): JSX.Element => {
  return <ToastContainer position={position} autoClose={autoClose} />;
};

// Function to activate toast appearance
export const showToast = (
  message: string,
  type: "default" | "success" | "error" | "info" | "warning" = "default"
): void => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message);
      break;
    case "warning":
      toast.warn(message);
      break;
    default:
      toast(message);
  }
};

export default CustomToast;
