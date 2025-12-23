import { useState } from 'react';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    icon: UserGroupIcon,
    color: 'text-blue-500',
  },
  {
    name: 'Total Properties',
    value: '1,234',
    change: '+8.2%',
    icon: BuildingOfficeIcon,
    color: 'text-green-500',
  },
  {
    name: 'Total Revenue',
    value: '$45,231',
    change: '+23.1%',
    icon: CurrencyDollarIcon,
    color: 'text-yellow-500',
  },
  {
    name: 'Pending Documents',
    value: '12',
    change: '-2.5%',
    icon: DocumentTextIcon,
    color: 'text-red-500',
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'added a new property',
    time: '2 minutes ago',
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'updated their profile',
    time: '5 minutes ago',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    action: 'submitted a document',
    time: '10 minutes ago',
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="btn btn-primary">Generate Report</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">{stat.name}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  <p className="text-sm text-success mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-base-200 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Activity</h2>
          <div className="divider"></div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-8">
                    <span>{activity.user.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="text-xs text-base-content/70">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="divider"></div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary">Add Property</button>
              <button className="btn btn-secondary">Add User</button>
              <button className="btn btn-accent">Generate Report</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">System Status</h2>
            <div className="divider"></div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Server Status</span>
                <span className="badge badge-success">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Database Status</span>
                <span className="badge badge-success">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Backup</span>
                <span>2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Upcoming Tasks</h2>
            <div className="divider"></div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span>Review new property listings</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span>Process pending documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span>Update user permissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 