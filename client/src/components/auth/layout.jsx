import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, Map, Sparkles, ArrowRight, Globe, Network } from "lucide-react";

function AuthLayout() {
  const [animatedText, setAnimatedText] = useState("");
  const fullText = "Connect. Manage. Grow.";
  const [currentIcon, setCurrentIcon] = useState(0);
  
  const icons = [Users, Map, Network, Globe, Sparkles];
  
  useEffect(() => {
    // Typing animation
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setAnimatedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    // Rotating icons animation
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 3000);
    
    return () => clearInterval(iconInterval);
  }, []);

  const CurrentIcon = icons[currentIcon];

  return (
    <div className="flex min-h-screen w-full">
      {/* Animated Left Side */}
      <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black w-1/2 px-12 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: 0.2 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-md space-y-8 text-center">
          {/* Animated icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <CurrentIcon className="w-16 h-16 text-purple-400 opacity-75" />
              </div>
              <CurrentIcon className="relative w-16 h-16 text-white animate-pulse" />
            </div>
          </div>
          
          {/* Main title with gradient */}
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200 animate-gradient">
            Welcome to PeopleMap
          </h1>
          
          {/* Typing animation subtitle */}
          <div className="h-8">
            <p className="text-xl text-purple-200 font-light">
              {animatedText}
              <span className="animate-blink">|</span>
            </p>
          </div>
          
          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['Contact Management', 'Interactive Maps', 'Analytics', 'Team Collaboration'].map((feature, index) => (
              <span
                key={feature}
                className="px-3 py-1 text-sm bg-white/10 backdrop-blur-sm rounded-full text-gray-200 border border-white/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {feature}
              </span>
            ))}
          </div>
          
          {/* Stats section */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Users', value: '10K+', icon: Users },
              { label: 'Contacts', value: '1M+', icon: Network },
              { label: 'Countries', value: '50+', icon: Globe },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <stat.icon className="w-5 h-5 mx-auto text-purple-300 mb-2" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* CTA Arrow */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowRight className="w-6 h-6 text-white/50 rotate-90" />
          </div>
        </div>
      </div>
      
      {/* Right Side - Auth Forms */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default AuthLayout;