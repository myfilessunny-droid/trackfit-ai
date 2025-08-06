import React from "react";

const SettingsPrivacy = () => (
  <div className="max-w-xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Privacy</h1>
    <p className="mb-4 text-gray-600">
      Control your data and privacy settings.
    </p>
    <div className="space-y-4">
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="form-checkbox" />
        <span>Allow data for research</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="form-checkbox" />
        <span>Enable anonymized analytics</span>
      </label>
    </div>
  </div>
);

export default SettingsPrivacy;
