import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import CommonForm from "../../components/common/form";
import { loginFormControls } from "../../config/index";
import { useDispatch } from "react-redux";
import { loginUser, setEmail } from "@/store/auth-slice";
import { toast } from 'sonner';

const initialState = {
    email: '',
    password: '',
}

function AuthLogin(){
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function onSubmit(event){
        event.preventDefault();
        dispatch(loginUser(formData)).then((data) => {
            if (data?.payload?.verified) {
                toast.success(data?.payload?.msg);
                navigate('/people/home');
            } else if (data?.payload?.verified === false) {
                // Email not verified
                dispatch(setEmail(data?.payload?.email));
                toast.error("Please verify your email first");
                navigate('/auth/verify-email');
            } else {
                toast.error(data?.payload?.errors?.non_field_errors?.[0] || "Login failed");
            }
        });
    }
    function handleForgetPassword(){
        navigate('/auth/forget-password');
    }

    function handleVerifyAccount(){
        navigate('/auth/verify-email')
    }
    
    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
                <p className="mt-2">Don't have an account</p>
                <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/register'>Register</Link>
            </div>
            <CommonForm 
            formControls={loginFormControls}
            buttonText={'Sign In'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            />
            <div className="text-center">
                <button 
                    onClick={handleForgetPassword}
                    className="text-sm text-primary hover:underline focus:outline-none"
                >
                    Forgot Password?
                </button>
            </div>

            <div className="text-center">
                <button 
                    onClick={handleVerifyAccount}
                    className="text-sm text-primary hover:underline focus:outline-none"
                >
                    Verify Account
                </button>
            </div>
        </div>
    );
}

export default AuthLogin;