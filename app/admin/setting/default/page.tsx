"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import Swal from "sweetalert2";

const Page = () => {
  const [activeSection, setActiveSection] = useState("Distance");
  const [formData, setFormData] = useState({
    distance: "km",
    address: "",
    license: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const sections = [
    "Distance",
    "Dealer Address",
    "Dealer License No",
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/default-settings');
      if (response.ok) {
        const data = await response.json();
        setFormData({
          distance: data.distance || "km",
          address: data.address || "",
          license: data.license || ""
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/default-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (window.dispatchEvent) {
          window.dispatchEvent(new Event('distance-updated'));
        }
        
        Swal.fire({
          title: "Settings Saved!",
          text: "Your configuration has been updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to save settings. Please try again.",
        icon: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Default Settings
                </h1>
                <p className="text-slate-600">
                  Configure your dealership default settings
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="text-right mr-6">
                  <p className="text-sm text-slate-500">Active Section</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {activeSection}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Navigation */}
            <div className="w-full md:w-1/4 p-6 border-b md:border-b-0 md:border-r border-slate-200">
              <div className="space-y-3">
                {sections.map((section) => (
                  <div
                    key={section}
                    className={`cursor-pointer rounded-xl p-4 transition-all duration-200 ${
                      activeSection === section
                        ? "bg-indigo-500 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    onClick={() => setActiveSection(section)}
                  >
                    <div className="flex items-center">
                      <div className={`mr-3 w-2 h-2 rounded-full ${
                        activeSection === section ? "bg-white" : "bg-indigo-500"
                      }`}></div>
                      <span className="font-medium">{section}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="w-full md:w-3/4 p-6">
              <form onSubmit={handleSubmit}>
                {activeSection === "Distance" && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Distance Settings</h2>
                    <div className="mb-4">
                      <label htmlFor="distance" className="block text-sm font-medium text-slate-700 mb-2">
                        Default Distance Measurement
                      </label>
                      <Select 
                        id="distance"
                        name="distance"
                        value={formData.distance}
                        onChange={handleInputChange}
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="km">Kilometers (km)</option>
                        <option value="miles">Miles</option>
                      </Select>
                    </div>
                    <p className="text-sm text-slate-500">
                      Set your preferred unit for distance measurements
                    </p>
                  </div>
                )}

                {activeSection === "Dealer Address" && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Dealer Address</h2>
                    <div className="mb-4">
                      <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                        Embedded Google Maps Link
                      </label>
                      <Textarea
                        id="address"
                        name="address"
                        rows={6}
                        value={formData.address}
                        onChange={handleInputChange}
                       placeholder='<iframe class="custom-map-placeholder" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.3833161665298!2d-118.03745848530627!3d33.85401093559897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dd2c6c97f8f3ed%3A0x47b1bde165dcc056!2sOak+Dr%2C+La+Palma%2C+CA+90623%2C+USA!5e0!3m2!1sen!2sbd!4v1544238752504" width="600" height="450" frameborder="0" allowfullscreen></iframe>'
                       className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
                      />
                    </div>
                    <p className="text-sm text-slate-500">
                      Paste your Google Maps iframe code here to display your location
                    </p>
                  </div>
                )}

                {activeSection === "Dealer License No" && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Dealer License</h2>
                    <div className="mb-4">
                      <label htmlFor="license" className="block text-sm font-medium text-slate-700 mb-2">
                        Dealer License Number
                      </label>
                      <TextInput
                        id="license"
                        name="license"
                        value={formData.license}
                        onChange={handleInputChange}
                        placeholder="ABCD12345678"
                        className="rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <p className="text-sm text-slate-500">
                      Enter your official dealership license number
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;