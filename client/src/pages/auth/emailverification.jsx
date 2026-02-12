import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, sendVerificationEmail } from "@/store/auth-slice";
import CommonForm from "../../components/common/form";
import { verifyEmailFormControls } from "../../config/index";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  verification_code: "",
};

function EmailVerificationPage() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isVerified, message, error, email: storedEmail } = useSelector(
    (state) => state.auth
  );

  // Set email from Redux state when component mounts
  useEffect(() => {
    if (storedEmail) {
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, [storedEmail]);

  // Redirect to login after successful verification
  useEffect(() => {
    if (isVerified) {
      toast.success("Email verified successfully! Please login.");
      navigate('/auth/login');
    }
  }, [isVerified, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(verifyEmail(formData)).then((res) => {
      if (res?.payload?.verified) {
        toast.success(res.payload.msg);
      } else {
        toast.error(res.payload?.msg || "Verification failed");
      }
    });
  };

  const handleResend = () => {
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }
    dispatch(sendVerificationEmail({ email: formData.email })).then((res) => {
      if (res?.payload?.resend) {
        toast.success("Verification email sent!");
      } else {
        toast.error(res.payload?.msg || "Failed to resend email");
      }
    });
  };

  // Function to get error message string
  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (typeof error === 'object') {
      return error.msg || error.error || error.message || JSON.stringify(error);
    }
    return "Verification failed";
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Verify Account
        </h1>
        <p className="mt-2">
          Enter the verification code sent to {formData.email || "your email"}.
        </p>
      </div>

      <CommonForm
        formControls={verifyEmailFormControls}
        buttonText={isLoading ? "Processing..." : "Verify"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <div className="flex justify-between items-center">
        <button
          type="button"
          className="text-sm text-primary underline hover:text-primary/80"
          onClick={handleResend}
          disabled={isLoading || !formData.email}
        >
          Resend Verification Email
        </button>
        
        <button
          type="button"
          className="text-sm text-gray-600 hover:text-gray-900"
          onClick={() => navigate('/auth/login')}
        >
          Back to Login
        </button>
      </div>

      {message && <p className="text-green-600 mt-2 text-center">{message}</p>}
      {errorMessage && <p className="text-red-600 mt-2 text-center">{errorMessage}</p>}
    </div>
  );
}

export default EmailVerificationPage;