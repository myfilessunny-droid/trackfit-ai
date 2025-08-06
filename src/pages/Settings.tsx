import React from "react";
import { Button } from "@/components/ui/button";

const Settings = () => (
  <div className="max-w-2xl mx-auto p-6 space-y-8">
    <h1 className="text-3xl font-bold mb-6">Settings</h1>
    <div className="space-y-6">
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <span className="mr-2">🔔</span>Notifications
        </h2>
        <p className="text-gray-600 mb-4">
          Manage your notification preferences for reminders, updates, and more.
        </p>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Meal reminders</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Workout reminders</span>
          </label>
        </div>
      </section>
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <span className="mr-2">🎯</span>Goals & Preferences
        </h2>
        <p className="text-gray-600 mb-4">
          Set your daily goals and customize your experience.
        </p>
        <div className="space-y-2">
          <label className="block">
            Daily Calorie Goal
            <input
              type="number"
              className="mt-1 px-3 py-2 border rounded w-full"
              placeholder="e.g. 2000"
            />
          </label>
          <label className="block">
            Preferred Diet
            <select className="mt-1 px-3 py-2 border rounded w-full">
              <option>None</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Keto</option>
              <option>Low Carb</option>
            </select>
          </label>
        </div>
        <Button className="mt-4">Save Preferences</Button>
      </section>
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <span className="mr-2">👤</span>Privacy
        </h2>
        <p className="text-gray-600 mb-4">
          Control your data and privacy settings.
        </p>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Allow data for research</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Enable anonymized analytics</span>
          </label>
        </div>
      </section>
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <span className="mr-2">⚙️</span>App Settings
        </h2>
        <p className="text-gray-600 mb-4">
          General app preferences and advanced options.
        </p>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Dark mode</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Enable beta features</span>
          </label>
        </div>
      </section>
    </div>
  </div>
);

export default Settings;
