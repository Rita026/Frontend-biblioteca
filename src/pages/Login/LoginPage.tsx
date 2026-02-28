import { UserAuthForm } from "./components/UserAuthForm"

export default function LoginPage() {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 fade-in show">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white fade-in show">
        <div className="mx-auto grid w-full max-w-[350px] gap-6 fade-in show">
          <div className="flex flex-col items-center text-center space-y-2 fade-in show">
            {/* UTT Logo Placeholder */}
            <div className="mb-4 fade-in show">
              <img 
                src="/logo.png" 
                alt="UTT Logo" 
                className="h-16 w-auto"
              />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 fade-in show">
              Welcome back
            </h1>
          </div>
          
          {/* FORM WITH ANIMATION */}
          <div className="fade-in show">
            <UserAuthForm />
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden bg-[#Dbe4ff] lg:flex flex-col items-center justify-center p-8 relative overflow-hidden fade-in show">
        <div className="relative z-10 w-full max-w-lg fade-in show">
           <img
             src="/biblioteca.avif"
             alt="Library Illustration"
             className="w-full h-auto object-contain mix-blend-multiply rounded-xl shadow-xl fade-in show"
           />
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-white/20 rounded-full blur-3xl -z-0"></div>
      </div>
    </div>
  )
}
