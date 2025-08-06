import React from "react";
import { Button } from "@/components/ui/button";

const SettingsGoals = () => (
  <div className="max-w-xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Goals & Preferences</h1>
    <p className="mb-4 text-gray-600">
      Set your daily goals and customize your experience.
    </p>
    <div className="space-y-4">
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
  </div>
);

export default SettingsGoals;
