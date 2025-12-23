import { useState } from 'react';
import {
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CreditCardIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'appearance', name: 'Appearance', icon: GlobeAltIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <ul className="menu menu-lg">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <a
                      className={activeTab === tab.id ? 'active' : ''}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Profile Settings</h2>
                  <div className="flex items-center space-x-4">
                    <div className="avatar">
                      <div className="w-24 rounded-full">
                        <img src="https://ui-avatars.com/api/?name=Admin+User" />
                      </div>
                    </div>
                    <button className="btn btn-outline">Change Avatar</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="First Name"
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Last Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone"
                        className="input input-bordered"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-primary">Save Changes</button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-base-content/70">
                          Receive email notifications for important updates
                        </p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-base-content/70">
                          Receive push notifications on your device
                        </p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-base-content/70">
                          Receive SMS notifications for urgent matters
                        </p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Current Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">New Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="New Password"
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Confirm New Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="input input-bordered"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button className="btn btn-primary">Update Password</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Appearance Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Theme</h3>
                      <div className="flex gap-4">
                        <button className="btn btn-outline">Light</button>
                        <button className="btn btn-outline">Dark</button>
                        <button className="btn btn-outline">System</button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Color Scheme</h3>
                      <div className="flex gap-2">
                        <button className="btn btn-primary">Primary</button>
                        <button className="btn btn-secondary">Secondary</button>
                        <button className="btn btn-accent">Accent</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Billing Settings</h2>
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title">Current Plan</h3>
                      <p className="text-2xl font-bold">Pro Plan</p>
                      <p className="text-base-content/70">$29/month</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary">Upgrade Plan</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 