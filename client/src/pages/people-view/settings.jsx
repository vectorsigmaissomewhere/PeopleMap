import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  updateProfile, 
  changePassword, 
  toggleTheme,
  resetProfileUpdateSuccess,
  resetPasswordChangeSuccess,
  clearError
} from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Moon,
  Sun,
  Save,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  Shield
} from "lucide-react";

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    user, 
    isLoading, 
    error, 
    message, 
    theme,
    profileUpdateSuccess,
    passwordChangeSuccess 
  } = useSelector((state) => state.auth);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    password2: ""
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Update profile form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || ""
      });
    }
  }, [user]);

  // Handle success messages
  useEffect(() => {
    if (profileUpdateSuccess) {
      toast.success("Profile updated successfully");
      dispatch(resetProfileUpdateSuccess());
      setIsSubmittingProfile(false);
    }
    if (passwordChangeSuccess) {
      toast.success("Password changed successfully");
      setPasswordForm({ password: "", password2: "" });
      dispatch(resetPasswordChangeSuccess());
      setIsSubmittingPassword(false);
    }
    if (message) {
      toast.success(message);
    }
  }, [profileUpdateSuccess, passwordChangeSuccess, message, dispatch]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'An error occurred');
      dispatch(clearError());
      setIsSubmittingProfile(false);
      setIsSubmittingPassword(false);
    }
  }, [error, dispatch]);

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmittingProfile) return;

    // Validate
    if (!profileForm.name.trim()) {
      toast.warning("Display name is required");
      return;
    }

    // Check if anything changed
    if (profileForm.name === user?.name && profileForm.email === user?.email) {
      toast.info("No changes to save");
      return;
    }

    setIsSubmittingProfile(true);
    await dispatch(updateProfile(profileForm));
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmittingPassword) return;

    // Validate
    if (!passwordForm.password) {
      toast.warning("New password is required");
      return;
    }

    if (passwordForm.password.length < 8) {
      toast.warning("Password must be at least 8 characters long");
      return;
    }

    if (passwordForm.password !== passwordForm.password2) {
      toast.warning("Passwords do not match");
      return;
    }

    setIsSubmittingPassword(true);
    await dispatch(changePassword(passwordForm));
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl dark:text-white">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Profile
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* Email Field (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="pl-10 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Display Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-gray-300">
                    Display Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="Enter your display name"
                      disabled={isSubmittingProfile}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                  {isSubmittingProfile ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl dark:text-white">
                <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Change Password
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-300">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                      className="pl-10 pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="Enter new password"
                      disabled={isSubmittingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password2" className="dark:text-gray-300">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="password2"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.password2}
                      onChange={(e) => setPasswordForm({ ...passwordForm, password2: e.target.value })}
                      className="pl-10 pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="Confirm new password"
                      disabled={isSubmittingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                  {isSubmittingPassword ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Changing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Change Password
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Appearance Section */}
          {/*
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                {theme === 'light' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-400" />
                )}
                Appearance
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="theme-toggle" className="text-foreground">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme across the app
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  <Switch
                    id="theme-toggle"
                    checked={theme === 'dark'}
                    onCheckedChange={handleThemeToggle}
                  />
                  <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          */}

          {/* Account Security Note */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
            <p>Your account security is important to us</p>
            <p className="text-xs mt-1">© 2026 Family Tree. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;