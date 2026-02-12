import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import CommonForm from "../../components/common/form";

const initialState = {
  email: "",
};

const forgetPasswordFormControls = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
];

function ForgetPassword() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/send-reset-password-email/",
        formData
      );
      
      if (response.data?.msg) {
        toast.success(response.data.msg);
        // Optionally redirect to login or show success message
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Forgot Password
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <CommonForm
        formControls={forgetPasswordFormControls}
        buttonText={isLoading ? "Sending..." : "Send Reset Link"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      <div className="text-center">
        <button
          onClick={() => navigate('/auth/login')}
          className="text-sm text-primary hover:underline focus:outline-none"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgetPassword;