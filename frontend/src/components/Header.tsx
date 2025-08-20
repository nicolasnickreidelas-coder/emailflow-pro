import React from 'react'
import { useAuth } from '../context/AuthContext'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const Header: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Welcome back, {user?.name}
          </h2>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button className="flex items-center text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
              <img
                className="h-8 w-8 rounded-full"
                src={user?.avatar || '/default-avatar.png'}
                alt=""
              />
              <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" />
            </button>
          </div>
          <button
            onClick={logout}
            className="ml-4 text-sm text-gray-500 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header