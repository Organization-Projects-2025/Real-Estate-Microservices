import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-60 h-full bg-gray-100 dark:bg-gray-900 p-4">
      <ul className="space-y-2">
        <li>
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition duration-200"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/manage-properties"
            className="block px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition duration-200"
          >
            Manage Properties
          </Link>
        </li>
        <li>
          <Link
            to="/manage-users"
            className="block px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition duration-200"
          >
            Manage Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
