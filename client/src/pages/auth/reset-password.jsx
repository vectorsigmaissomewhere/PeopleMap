import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import CommonForm from "../../components/common/form";

const initialState = {
  password: "",
  confirm_password: "",
};

const resetPasswordFormControls = [
  {
    name: "password",
    label: "New Password",
    type: "password",
    placeholder: "Enter new password",
    required: true,
  },
  {
    name: "confirm_password",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm new password",
    required: true,
  },
];

function ResetPassword() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const navigate = useNavigate();
  const { uid, token } = useParams();

  // Validate token on component mount
  useEffect(() => {
    // You can add token validation here if you have an endpoint for it
    if (!uid || !token) {
      setIsValidToken(false);
      toast.error("Invalid password reset link");
    }
  }, [uid, token]);

  async function onSubmit(event) {
    event.preventDefault();
    
    // Validate passwords
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios({
        method: 'post',
        url: `http://127.0.0.1:8000/api/user/reset-password/${uid}/${token}/`,
        data: {
          password: formData.password,
          password2: formData.confirm_password
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': null
        },
        withCredentials: false
      });
      
      if (response.data?.msg) {
        toast.success(response.data.msg);
        // Clear form
        setFormData(initialState);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Password reset error:', error.response || error);
      
      // Handle different error responses
      if (error.response?.status === 404) {
        toast.error("Invalid or expired reset link. Please request a new one.");
        setIsValidToken(false);
      } else if (error.response?.data?.password) {
        toast.error(error.response.data.password[0]);
      } else if (error.response?.data?.password2) {
        toast.error(error.response.data.password2[0]);
      } else if (error.response?.data?.msg) {
        toast.error(error.response.data.msg);
      } else if (error.response?.data?.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      } else {
        toast.error("Password reset failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!isValidToken) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Invalid Reset Link
          </h1>
          <p className="mt-4 text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/auth/forget-password')}
              className="text-sm text-primary hover:underline focus:outline-none"
            >
              Request a new reset link
            </button>
          </div>
          <div className="mt-2">
            <button
              onClick={() => navigate('/auth/login')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      <CommonForm
        formControls={resetPasswordFormControls}
        buttonText={isLoading ? "Resetting..." : "Reset Password"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        buttonDisabled={isLoading}
      />

      <div className="text-center">
        <button
          onClick={() => navigate('/auth/login')}
          className="text-sm text-primary hover:underline focus:outline-none"
          type="button"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;