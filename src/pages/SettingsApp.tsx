import React from "react";

const SettingsApp = () => (
  <div className="max-w-xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">App Settings</h1>
    <p className="mb-4 text-gray-600">
      General app preferences and advanced options.
    </p>
    <div className="space-y-4">
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="form-checkbox" />
        <span>Dark mode</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="form-checkbox" />
        <span>Enable beta features</span>
      </label>
    </div>
  </div>
);

export default SettingsApp;
