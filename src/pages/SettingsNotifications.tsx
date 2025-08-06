import React from "react";

const SettingsNotifications = () => (
  <div className="max-w-xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Notifications</h1>
    <p className="mb-4 text-gray-600">
      Manage your notification preferences for reminders, updates, and more.
    </p>
    <div className="space-y-4">
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="form-checkbox" />
        <span>Meal reminders</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="form-checkbox" />
        <span>Workout reminders</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="form-checkbox" />
        <span>App updates</span>
      </label>
    </div>
  </div>
);

export default SettingsNotifications;
