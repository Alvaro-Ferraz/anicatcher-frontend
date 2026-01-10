import { useState } from "react"
import type { ReactNode } from "react"
import logo from '../../../assets/images/Logo-ani.3.png';
import avatar from '../../../assets/images/avatar.png';
import TemporadaAtual from '../../AnimeSeason';
import { Link } from "react-router-dom";


const ClientLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded)
  }

  const sidebarWidth = isSidebarExpanded ? "250px" : "60px"

  return (
    <div className="bg-body min-h-screen text-white">
      <header className="flex justify-between items-center p-4 bg-sidebar border-b border-gray-700 fixed top-0 left-0 w-full z-10">
        <div className="flex items-center space-x-3 sm:space-x-6 flex-1 min-w-0">
          <button
            className="sm:hidden text-white focus:outline-none ml-2 flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <img
            src={logo || "/placeholder.svg"}
            alt="Logo"
            className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full flex-shrink-0"
          />

            <div className="hidden md:flex space-x-4 lg:space-x-6 min-w-0">
            <Link to="/home" className="text-sm text-white hover:text-gray-300 whitespace-nowrap">
              Home
            </Link>
            <Link to="/anime/search" className="text-sm text-white hover:text-gray-300 whitespace-nowrap">
              Animelist
            </Link>
            <Link to="#" className="text-sm text-white hover:text-gray-300 line-through whitespace-nowrap">
              Comunity
            </Link>
            <Link to="#" className="text-sm text-white hover:text-gray-300 line-through whitespace-nowrap">
              Perfil
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <input
            type="text"
            placeholder="Search..."
            className="hidden sm:block bg-utils border text-white border-gray-600 px-2 py-1 rounded text-sm w-32 md:w-40 lg:w-48"
          />

          <button className="sm:hidden text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>

          <div className="flex-shrink-0">
            <Link to="">
              <img
                src={avatar || "/placeholder.svg"}
                alt="Avatar"
                className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] bg-size-cover rounded-[3px]"
              />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex pt-[68px] overflow-x-hidden">
        <div className="relative group hidden sm:block">
          <div
            className="fixed top-[68px] left-0 h-[calc(100vh-68px)] transition-all duration-500 ease-in-out"
            style={{ width: isSidebarExpanded ? "250px" : "80px" }}
          >
            <div
              className="bg-sidebar p-5 h-full border-r border-gray-700 overflow-y-auto transition-all duration-500 ease-in-out sidebar"
              style={{ width: sidebarWidth }}
            >
              {isSidebarExpanded && (
                <>
                  <TemporadaAtual />
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search for name..."
                      className="bg-utils text-red-400 pl-10 pr-3 py-2 rounded w-full text-sm placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  <div className="w-full bg-utils p-5 rounded">
                    <h2 className="text-lg font-medium text-white mb-4">My favorites</h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 group cursor-pointer hover:bg-[#2D3748] p-1 rounded transition-colors">
                        <img
                          src="https://static.betterstatic.dev/cover/sXtu0Ok6pjGMemqj2zDTtQtnCDZHNjlovKJzPHYC.jpg"
                          alt="Sakurasou no pet na kanojo"
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 self-center">
                          <h3 className="text-sm text-white group-hover:text-gray-200">Sakurasou no pet na kanojo</h3>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 group cursor-pointer hover:bg-[#2D3748] p-1 rounded transition-colors">
                        <img
                          src="https://static.betterstatic.dev/cover/sXtu0Ok6pjGMemqj2zDTtQtnCDZHNjlovKJzPHYC.jpg"
                          alt="Sakurasou no pet na kanojo"
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 self-center">
                          <h3 className="text-sm text-white group-hover:text-gray-200">Sakurasou no pet na kanojo</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className={`fixed top-[50%] transform -translate-y-1/2 z-20 transition-opacity duration-500 ease-in-out ${isSidebarExpanded ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            style={{ left: sidebarWidth, transition: "left 0.5s" }}
          >
            <button onClick={toggleSidebar} className="text-white focus:outline-none rounded-full">
              <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 text-gray-400 hover:text-white transition-colors"
                style={{ transform: isSidebarExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path fill="currentColor" d="M8 4l8 8-8 8"></path>
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex sm:hidden">
            <div className="bg-sidebar w-64 h-full p-6 flex flex-col">
              <button
                className="self-end mb-6 text-gray-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6 space-y-4">
                <Link to="/home" className="block text-white hover:text-gray-300 py-2">
                  Home
                </Link>
                <Link to="/anime/search" className="block text-white hover:text-gray-300 py-2">
                  Animelist
                </Link>
                <Link to="#" className="block text-white hover:text-gray-300 line-through py-2">
                  Comunity
                </Link>
                <Link to="#" className="block text-white hover:text-gray-300 line-through py-2">
                  Perfil
                </Link>
              </div>

              <div className="relative mb-6 mt-4">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for name..."
                  className="bg-utils text-red-400 pl-10 pr-3 py-2 rounded w-full text-sm placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div className="w-full bg-utils p-5 rounded">
                <h2 className="text-lg font-medium text-white mb-4">My favorites</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group cursor-pointer hover:bg-[#2D3748] p-1 rounded transition-colors">
                    <img
                      src="https://static.betterstatic.dev/cover/sXtu0Ok6pjGMemqj2zDTtQtnCDZHNjlovKJzPHYC.jpg"
                      alt="Sakurasou no pet na kanojo"
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 self-center">
                      <h3 className="text-sm text-white group-hover:text-gray-200">Sakurasou no pet na kanojo</h3>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 group cursor-pointer hover:bg-[#2D3748] p-1 rounded transition-colors">
                    <img
                      src="https://static.betterstatic.dev/cover/sXtu0Ok6pjGMemqj2zDTtQtnCDZHNjlovKJzPHYC.jpg"
                      alt="Sakurasou no pet na kanojo"
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 self-center">
                      <h3 className="text-sm text-white group-hover:text-gray-200">Sakurasou no pet na kanojo</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        <div
          className="flex-1 sm:px-6 transition-all duration-500 ease-in-out ml-0 sm:ml-[50px] sm:data-[expanded=true]:ml-[280px] overflow-x-hidden"
          data-expanded={isSidebarExpanded}
        >
          <main
            className="w-full mx-auto transition-all duration-500 ease-in-out max-w-[1400px] sm:data-[expanded=true]:max-w-[1200px]"
            data-expanded={isSidebarExpanded}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ClientLayout
