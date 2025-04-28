"use client"

import { LogIn, LogOut, User } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useWallet } from "../../context/WalletContext"
import { useAuth } from "@/context/AuthContext"
import { truncateAddress } from "../../utils/helpers"
import ConnectWalletButton from "./ui/connect-wallet-button"
import auroraBrain from "../../assets/auroraLogo.jpg"


const Header = ({ onMenuClick }) => {
  const { address } = useWallet()
  const { user, logout, isAuthenticated, isLoadingUser } = useAuth()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const routeMap = {
    skills: "/skills",
    grammar: "/grammar",
    vocabulary: "/vocabulary",
    "business english": "/business-english",
    community: "/people",
    settings: "/settings",
  }

  const handleNavClick = (key) => {
    const path = routeMap[key.toLowerCase()]
    if (path) navigate(path)
    else console.warn("❗Ruta inválida desde Header:", key)
  }

  return (
    <header className="h-16 bg-background text-foreground px-6 border-b shadow-sm">
      <div className="flex items-center justify-between h-full max-w-[1440px] mx-auto">
        {/* Left: Logo + Nav */}
        <div className="flex items-center space-x-10">
          <img
            src={auroraBrain}
            alt="Aurora Logo"
            className="h-10 w-auto"
          />
          <nav className="hidden md:flex space-x-6">
            {["Skills", "Grammar", "Vocabulary", "Business English", "Community"].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-sm font-medium text-foreground hover:text-blue-600"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Auth & Wallet */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated && !isLoadingUser ? (
            <div className="flex gap-3 items-center">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-1.5 bg-[#00cfff] text-white rounded-md text-sm hover:bg-[#00b8e6] shadow-sm"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="h-9 w-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
              >
                <User className="h-5 w-5" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-700">{user?.firstName}</p>
                    <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => navigate("/profile")}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                    >
                      Your Profile
                    </button>
                    <button
                      onClick={() => navigate("/learning-path")}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                    >
                      Learning Path
                    </button>
                  </div>
                  {address && (
                    <div className="px-4 py-2 border-t border-blue-100">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>Wallet:</span>
                        <span className="font-medium">{truncateAddress(address)}</span>
                      </div>
                    </div>
                  )}
                  <div className="border-t">
                    <button
                      onClick={() => {
                        logout()
                        setShowProfileMenu(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="hidden sm:block">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
