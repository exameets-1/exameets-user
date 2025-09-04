'use client'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { register, clearAllUserErrors } from "@/store/slices/userSlice.js";
import { toast } from "react-toastify";
import PreferencesModal from "@/components/PreferencesModal/PreferencesModal.jsx";
import useScrollToTop from "@/hooks/useScrollToTop.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CustomSelect from '@/components/CustomSelect/CustomSelect'; // Adjust path as needed




const Register = () => {
  useScrollToTop();
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [countryCode, setCountryCode] = useState("+91"); // Default country code
  // Checkbox states
  const [is13Checked, setIs13Checked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
    hasUpper: false,
    hasLower: false,
    matches: false,
  });

  const validatePassword = (password, confirmPass) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      matches: password === confirmPass && password !== "",
    });
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const countryCodeOptions = [
    { value: '+91', label: '+91' },
    // { value: '+1', label: '+1 (US/Canada)' },
    // { value: '+44', label: '+44 (UK)' },
  // Add more as needed
  ];

  useEffect(() => {
    validatePassword(password, confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    if (error && error !== "User not authenticated" && error !== "Please login to access this resource") {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      setShowPreferences(true);
    }
  }, [dispatch, error, isAuthenticated]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    let interval;
    if (emailResendTimer > 0) {
      interval = setInterval(() => {
        setEmailResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailResendTimer]);


  {/*const handleSendOTP = async () => {
    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setSendingPhoneOtp(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setSendingPhoneOtp(false);
    }
  };*/}

  const handleSendEmailOTP = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setSendingEmailOtp(true);
      // Check if email exists
      const checkResponse = await fetch(`/api/user/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const checkData = await checkResponse.json();
      
      if (checkData.exists) {
        toast.error("Email is already registered");
        return;
      }

      const response = await fetch(`/api/email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setEmailOtpSent(true);
        toast.success("Email OTP sent successfully!");
        setEmailResendTimer(60);
      } else {
        toast.error(data.message || "Failed to send email OTP");
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      toast.error("Failed to send email OTP");
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword || !dob || !gender) {
      if (!gender) {
        toast.error("Please select your gender");
      }
      if (!dob) {
        toast.error("Please enter your date of birth");
      }
      if (!name) {
        toast.error("Please enter your name");
      }
      if (!email) {
        toast.error("Please enter your email");
      }
      if (!phone) {
        toast.error("Please enter your phone number");
      }
      if (!password || !confirmPassword) {
        toast.error("Please enter both passwords");
      }
      return;
    }

    // First verify email OTP
    if (!emailVerified) {
      try {
        const emailResponse = await fetch(`/api/email/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: emailOtp }),
        });
        const emailData = await emailResponse.json();
        if (!emailData.success) {
          toast.error("Invalid email OTP");
          return;
        }
        setEmailVerified(true);
      } catch (error) {
        toast.error("Failed to verify email OTP");
        return;
      }
    }

    {/*// Then verify phone OTP
    if (!otpVerified) {
      try {
        await verificationId.confirm(otp);
        setOtpVerified(true);
      } catch (error) {
        toast.error("Invalid phone OTP");
        return;
      }
    }*/}

    if (!Object.values(passwordValidation).every(Boolean)) {
      toast.error("Please ensure password meets all requirements");
      return;
    }

    try {
      const formData = {
        name,
        email,
        phone,
        dob: new Date(dob).toISOString(),
        gender,
        password,
      };

      const result = await dispatch(register(formData));
      if (register.fulfilled.match(result)) {
        toast.success("Registration successful!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    }
  };

  // const handleOtpChange = (e, setOtpFunction) => {
  //   const value = e.target.value;
  //   if (value === '' || /^\d+$/.test(value)) {
  //     setOtpFunction(value);
  //   }
  // };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center p-5 bg-white dark:bg-gray-800">
      <section className="w-full max-w-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl text-center text-[#015990] dark:text-gray-100 mb-8">Register</h2>

          <div className="mb-5">
            <label className="block text-[#015990] font-medium mb-2 dark:text-gray-100" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              autoComplete="name"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[#015990] font-medium mb-2 dark:text-gray-100" htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
            />
          </div>

          <div className="mb-5">
            <CustomSelect
              id="gender"
              label="Gender"
              value={gender}
              onChange={(value) => setGender(value)}
              options={genderOptions}
              placeholder="Select Gender"
              // required={true}
            />
          </div>

          <div className="mb-5">
  <label className="block text-[#015990] dark:text-gray-100 font-medium mb-2" htmlFor="phone">Phone Number</label>
  <div className="flex gap-2">
    <div className="w-32">
      <CustomSelect
        id="country-code"
        value={countryCode} // You'll need to add this state
        onChange={(value) => setCountryCode(value)} // You'll need to add this setter
        options={countryCodeOptions}
        placeholder="+91"
      />
    </div>
    <input
      type="tel"
      autoComplete="tel"
      id="phone"
      placeholder="Enter 10-digit Mobile Number"
      value={phone}
      onChange={(e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
          setPhone(value);
        }
      }}
      maxLength="10"
      required
      disabled={otpVerified}
      className="flex-1 pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
    />
  </div>
</div>

          <div className="mb-5">
            <label className="block text-[#015990] font-medium mb-2 dark:text-gray-100" htmlFor="email">Email ID</label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                autoComplete="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={emailVerified}
                className="w-full pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
              />
              {!emailVerified && (
                <button 
                  type="button" 
                  onClick={handleSendEmailOTP}
                  disabled={sendingEmailOtp}
                  className="px-4 py-2 bg-[#015990] text-white border-none rounded-lg cursor-pointer whitespace-nowrap hover:bg-blue-900 disabled:bg-gray-400"
                >
                  {sendingEmailOtp ? "Sending..." : (emailOtpSent ? "Resend OTP" : "Send OTP")}
                </button>
              )}
            </div>
            {emailOtpSent && emailResendTimer > 0 && (
              <span className="text-gray-600 text-xs mt-1 block">Resend in {emailResendTimer}s</span>
            )}
          </div>

          {/* OTP input as 6 boxes */}
          {emailOtpSent && !emailVerified && (
            <div className="mb-5">
              <label htmlFor="email-otp" className="block text-[#015990] font-medium mb-2 dark:text-gray-100">Enter Email OTP</label>
              <div className="flex gap-2 justify-center">
                {[...Array(6)].map((_, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={emailOtp[idx] || ""}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      let newOtp = emailOtp.split("");
                      newOtp[idx] = val;
                      setEmailOtp(newOtp.join(""));
                      // Move to next box if value entered
                      if (val && idx < 5) {
                        document.getElementById(`otp-box-${idx + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Backspace" && !emailOtp[idx] && idx > 0) {
                        document.getElementById(`otp-box-${idx - 1}`)?.focus();
                      }
                    }}
                    id={`otp-box-${idx}`}
                    className="w-10 h-12 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
                  />
                ))}
              </div>
              {emailVerified && (
                <span className="text-green-600 text-sm block mt-2">Verified</span>
              )}
            </div>
          )}

          <div className="mb-2 text-[#015990] dark:text-gray-100 font-medium">
            <label htmlFor="password">Create Password</label>
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={handleTogglePassword}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="text-[#015990] dark:text-gray-300" />
              ) : (
                <FaEye className="text-[#015990] dark:text-gray-300" />
              )}
            </span>
          </div>

          <div className="mb-2 text-[#015990] dark:text-gray-100 font-medium">
            <label htmlFor="confirm-password">Confirm Password</label>
          </div>
          <div className="mb-4 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirm-password"
              placeholder="Re-enter Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={handleToggleConfirmPassword}
              tabIndex={0}
              role="button"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="text-[#015990] dark:text-gray-300" />
              ) : (
                <FaEye className="text-[#015990] dark:text-gray-300" />
              )}
            </span>
          </div>

          <div className="mt-2 mb-4 text-xs text-gray-600">
            <p className={`mb-1 ${passwordValidation.minLength ? "text-green-600" : ""}`}>
              ✓ At least 8 characters
            </p>
            <p className={`mb-1 ${passwordValidation.hasUpper ? "text-green-600" : ""}`}>
              ✓ At least one uppercase letter
            </p>
            <p className={`mb-1 ${passwordValidation.hasLower ? "text-green-600" : ""}`}>
              ✓ At least one lowercase letter
            </p>
            <p className={`mb-1 ${passwordValidation.hasNumber ? "text-green-600" : ""}`}>
              ✓ At least one number
            </p>
            <p className={`mb-1 ${passwordValidation.hasSpecial ? "text-green-600" : ""}`}>
              ✓ At least one special character
            </p>
            <p className={`mb-1 ${passwordValidation.matches ? "text-green-600" : ""}`}>
              ✓ Passwords match
            </p>
          </div>
          
          {/* Age and Terms checkboxes */}
          <div className="mb-4 mt-6">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm">
              <input
                type="checkbox"
                checked={is13Checked}
                onChange={e => setIs13Checked(e.target.checked)}
                className="accent-[#015990] w-4 h-4 rounded"
                required
              />
              I'm at least 13 years old
            </label>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm mt-3">
              <input
                type="checkbox"
                checked={isTermsChecked}
                onChange={e => setIsTermsChecked(e.target.checked)}
                className="accent-[#015990] w-4 h-4 rounded"
                required
              />
              I agree to the
              <Link href="/terms-of-service" className="text-[#015990] underline hover:text-blue-700 ml-1" target="_blank">Terms of Service</Link>
              and
              <Link href="/privacy-policy" className="text-[#015990] underline hover:text-blue-700 ml-1" target="_blank">Privacy Policy</Link>
            </label>
          </div>
          <button 
            type="submit" 
            className="w-full py-3 mt-2 bg-[#015990] text-white border-none dark:bg-gray-950 dark:text-gray-100 rounded cursor-pointer text-base hover:bg-gray-950 disabled:bg-gray-400"
            disabled={loading || !is13Checked || !isTermsChecked}
          >
            {loading ? "Registering..." : "Next"}
          </button>
        </form>
        <div className="mt-4 text-center">
          Already having an account? <Link href="/login" className="text-[#015990] dark:text-gray-100">Sign in</Link>
        </div>
      </section>

      {showPreferences && (
        <PreferencesModal
          onClose={() => {
            setShowPreferences(false);
            router.push("/");
          }}
        />
      )}
    </div>
  );
};

export default Register;