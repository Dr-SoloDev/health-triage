import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-green-600">🏥 Dashboard อสม.</h1>
              </div>
              <div className="ml-6 flex space-x-4">
                <NavLink
                  to="/cases"
                  className={({ isActive }) =>
                    `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  รายการเคส
                </NavLink>
                <NavLink
                  to="/stats"
                  className={({ isActive }) =>
                    `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  สรุปรายวัน
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
