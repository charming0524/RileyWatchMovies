import { RegisterForm } from "@/components/register-form";
import { useAuth } from "@/context/auth";
import { Video } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Register() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.loading && auth.user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from);
      return;
    }
  }, [auth.loading, auth.user, location, navigate]);

  return (
    <div className="relative">
      {/* Background Image */}
      <img
        src="/auth_banner.jpg"
        alt="auth banner"
        className="absolute min-h-screen -z-20 w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/60" />

      {/* Content */}
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <p className="flex items-center text-3xl gap-2 self-center font-medium text-white">
            <Video className="size-7" />
            RileyWatch
          </p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
