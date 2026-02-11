import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, sendVerificationEmail, setEmail } from "@/store/auth-slice";
import CommonForm from "../../components/common/form";
import { verifyEmailFormControls } from "../../config/index";
import { toast } from "sonner";

const initialState = {
  email: "",
  verification_code: "",
};

function EmailVerificationPage() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading, isVerified, message, error, email: storedEmail } = useSelector(
    (state) => state.auth
  );
  
  useEffect(() => {
    if (storedEmail) {
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, [storedEmail]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(verifyEmail(formData)).then((res) => {
      if (res?.payload?.verified) {
        toast.success(res.payload.msg);
      } else {
        toast.error(res.payload?.error || "Verification failed");
      }
    });
  };

  const handleResend = () => {
    dispatch(sendVerificationEmail({ email: formData.email })).then((res) => {
      if (res?.payload?.resend) {
        toast.success("Verification email sent!");
      } else {
        toast.error("Failed to resend email");
      }
    });
  };

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

      <button
        type="button"
        className="text-sm text-primary underline mt-2"
        onClick={handleResend}
        disabled={!formData.email}
      >
        Resend Verification Email
      </button>

      {isVerified && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error.msg || error}</p>}
    </div>
  );
}

export default EmailVerificationPage;