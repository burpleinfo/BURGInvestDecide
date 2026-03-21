import React, { useRef, useState } from "react";

const ListYourFirmPage = () => {
  const logoInputRef = useRef(null);
  const certInputRef = useRef(null);
  const heroInputRef = useRef(null);

  const [logoFile, setLogoFile] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);

  const handleLogoClick = () => logoInputRef.current?.click();
  const handleCertClick = () => certInputRef.current?.click();
  const handleHeroClick = () => heroInputRef.current?.click();

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0] || null);
  };
  const handleCertChange = (e) => {
    setCertFile(e.target.files[0] || null);
  };
  const handleHeroChange = (e) => {
    setHeroFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const pwd = form.password.value;
    const confirm = form.confirmPassword.value;
    if (pwd !== confirm) {
      alert("Passwords do not match.");
      return;
    }
    const formData = new FormData(form);
    // Ensure files are included (for controlled file inputs)
    if (logoInputRef.current?.files[0]) {
      formData.set("logo", logoInputRef.current.files[0]);
    }
    if (certInputRef.current?.files[0]) {
      formData.set("companyCertificate", certInputRef.current.files[0]);
    }
    if (heroInputRef.current?.files[0]) {
      formData.set("heroImage", heroInputRef.current.files[0]);
    }
    try {
      const response = await fetch("https://klmsd.app.n8n.cloud/webhook/list-your-firm", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("Application submitted! Our team will verify and contact you soon.");
        form.reset();
        setLogoFile(null);
        setCertFile(null);
        setHeroFile(null);
      } else {
        alert("Submission failed. Please try again later.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      

      {/* Main Form Container */}
      <div className="form-container max-w-[900px] mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Join BURG InvestDecide</h1>
          <p className="text-gray-600">Become a verified partner and get your premium wlanding page + dashboard.</p>
        </div>

        <form id="firmRegistrationForm" onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Basic Information */}
          <div className="section-card bg-white rounded-3xl p-7 mb-8 shadow-md border border-gray-200">
            <h2 className="section-title text-2xl font-bold mb-4 text-[#1e1e1e] border-l-4 border-yellow-400 pl-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Firm Name <span className="text-red-500">*</span></label>
                <input type="text" name="firmName" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="e.g., Vatika Group" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Year Established</label>
                <input type="number" name="yearEstablished" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="YYYY" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Tagline (short description)</label>
                <input type="text" name="tagline" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="e.g., Creating the world's finest developments" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Firm Logo <span className="text-red-500">*</span></label>
                <div className="file-upload-area border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer transition hover:border-yellow-400 hover:bg-yellow-50" onClick={handleLogoClick}>
                  <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Click to upload logo (PNG, JPG)</p>
                  <input type="file" ref={logoInputRef} name="logo" className="hidden" accept="image/*" onChange={handleLogoChange} />
                  {logoFile && (
                    <p className="text-xs text-green-600 mt-2">Selected: {logoFile.name}</p>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="form-label font-medium mb-2 block text-gray-700">Full Description <span className="text-red-500">*</span></label>
                <textarea name="description" rows={4} className="form-textarea w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="Describe your firm's history, expertise, and what makes you unique..."></textarea>
              </div>
            </div>
          </div>

          {/* 2. Contact & Location */}
          <div className="section-card bg-white rounded-3xl p-7 mb-8 shadow-md border border-gray-200">
            <h2 className="section-title text-2xl font-bold mb-4 text-[#1e1e1e] border-l-4 border-yellow-400 pl-4">Contact & Location</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Primary Contact Email <span className="text-red-500">*</span></label>
                <input type="email" name="contactEmail" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">City <span className="text-red-500">*</span></label>
                <input type="text" name="city" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">State / Region</label>
                <input type="text" name="state" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label font-medium mb-2 block text-gray-700">Full Address</label>
                <input type="text" name="address" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="Street, building, area" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Google Maps Link (optional)</label>
                <input type="url" name="googleMaps" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="Paste Google Maps share link" />
              </div>
            </div>
          </div>

          {/* 3. Credentials & Verification */}
          <div className="section-card bg-white rounded-3xl p-7 mb-8 shadow-md border border-gray-200">
            <h2 className="section-title text-2xl font-bold mb-4 text-[#1e1e1e] border-l-4 border-yellow-400 pl-4">Credentials & Verification</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label font-medium mb-2 block text-gray-700">Company Registration Number (CIN / LLPIN) <span className="text-red-500">*</span></label>
                  <input type="text" name="companyRegNumber" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="e.g., U70100MH2015PTC123456" />
                </div>
                <div>
                  <label className="form-label font-medium mb-2 block text-gray-700">Date of Incorporation</label>
                  <input type="text" name="incorporationDate" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="e.g., 15 May 2010" />
                </div>
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Upload Company Registration Certificate <span className="text-red-500">*</span></label>
                <div className="file-upload-area border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer transition hover:border-yellow-400 hover:bg-yellow-50" onClick={handleCertClick}>
                  <i className="fas fa-file-pdf text-2xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Click to upload (PDF / Image)</p>
                  <input type="file" ref={certInputRef} name="companyCertificate" className="hidden" accept=".pdf,.jpg,.png" onChange={handleCertChange} />
                  {certFile && (
                    <p className="text-xs text-green-600 mt-2">Selected: {certFile.name}</p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label font-medium mb-2 block text-gray-700">RERA Registration (if applicable)</label>
                  <input type="text" name="reraNumber" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="e.g., RERA-PB-1234-2025" />
                </div>
                <div>
                  <label className="form-label font-medium mb-2 block text-gray-700">Number of Team Members</label>
                  <input type="number" name="teamSize" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="e.g., 10" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label font-medium mb-2 block text-gray-700">Years of Experience in Real Estate</label>
                  <input type="number" name="yearsExperience" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="e.g., 15" />
                </div>
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Industry Memberships / Certifications (e.g., CREDAI, NAR India, RICS)</label>
                <input type="text" name="certifications" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="List any relevant memberships or certifications" />
              </div>
            </div>
          </div>

          {/* 4. Branding & Appearance */}
          <div className="section-card bg-white rounded-3xl p-7 mb-8 shadow-md border border-gray-200">
            <h2 className="section-title text-2xl font-bold mb-4 text-[#1e1e1e] border-l-4 border-yellow-400 pl-4">Branding & Appearance</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Primary Brand Color (Hex)</label>
                <input type="text" name="primaryColor" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="#1e2b32" defaultValue="#1e2b32" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Accent Color (Hex)</label>
                <input type="text" name="accentColor" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="#fbbf24" defaultValue="#fbbf24" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Cover / Hero Image</label>
                <div className="file-upload-area border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer transition hover:border-yellow-400 hover:bg-yellow-50" onClick={handleHeroClick}>
                  <i className="fas fa-image text-2xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Click to upload (optional, will be used as background)</p>
                  <input type="file" ref={heroInputRef} name="heroImage" className="hidden" accept="image/*" onChange={handleHeroChange} />
                  {heroFile && (
                    <p className="text-xs text-green-600 mt-2">Selected: {heroFile.name}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Social Media Links</label>
                <div className="space-y-2">
                  <input type="url" name="linkedin" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="LinkedIn URL" />
                  <input type="url" name="instagram" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="Instagram URL" />
                </div>
              </div>
            </div>
          </div>

          {/* 5. Services & Specialization */}
          <div className="section-card bg-white rounded-3xl p-7 mb-8 shadow-md border border-gray-200">
            <h2 className="section-title text-2xl font-bold mb-4 text-[#1e1e1e] border-l-4 border-yellow-400 pl-4">Services & Specialization</h2>
            <div>
              <label className="form-label font-medium mb-2 block text-gray-700">What services do you offer? (Select all that apply) <span className="text-red-500">*</span></label>
              <div className="checkbox-group flex flex-wrap gap-4 mt-2">
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="services" value="Investment advisory" /> Investment advisory</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="services" value="Property acquisition" /> Property acquisition</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="services" value="Portfolio structuring" /> Portfolio structuring</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="services" value="NRI advisory" /> NRI advisory</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="services" value="Legal / due diligence" /> Legal / due diligence</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="services" value="Tax advisory" /> Tax advisory</label>
              </div>
            </div>
            <div className="mt-4">
              <label className="form-label font-medium mb-2 block text-gray-700">Property types you focus on</label>
              <div className="checkbox-group flex flex-wrap gap-4 mt-2">
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="propertyTypes" value="Residential" /> Residential</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="propertyTypes" value="Commercial" /> Commercial</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="propertyTypes" value="Land / Plots" /> Land / Plots</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="propertyTypes" value="Luxury" /> Luxury</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="propertyTypes" value="Affordable housing" /> Affordable housing</label>
              </div>
            </div>
            <div className="mt-4">
              <label className="form-label font-medium mb-2 block text-gray-700">Typical client investment range</label>
              <select name="investmentRange" className="form-select w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition">
                <option value="">Select range</option>
                <option>₹20L – ₹50L</option>
                <option>₹50L – ₹1Cr</option>
                <option>₹1Cr – ₹2Cr</option>
                <option>₹2Cr – ₹5Cr</option>
                <option>₹5Cr+</option>
              </select>
            </div>
          </div>

          {/* 6. Client Preferences */}
          <div className="section-card bg-white rounded-3xl p-7 mb-8 shadow-md border border-gray-200">
            <h2 className="section-title text-2xl font-bold mb-4 text-[#1e1e1e] border-l-4 border-yellow-400 pl-4">Client Management Preferences</h2>
            <div>
              <label className="form-label font-medium mb-2 block text-gray-700">Preferred meeting modes (select all that apply)</label>
              <div className="checkbox-group flex flex-wrap gap-4 mt-2">
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="meetingModes" value="Phone call" /> Phone call</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="meetingModes" value="Video call" /> Video call</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="meetingModes" value="In-office" /> In-office</label>
                <label className="checkbox-item flex items-center gap-2"><input type="checkbox" name="meetingModes" value="Site visit" /> Site visit</label>
              </div>
            </div>
            <div className="mt-4">
              <label className="form-label font-medium mb-2 block text-gray-700">Working hours (for meeting scheduling)</label>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="workStart" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="Start time e.g., 9:30 AM" />
                <input type="text" name="workEnd" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="End time e.g., 6:30 PM" />
              </div>
            </div>
            <div className="mt-4">
              <label className="form-label font-medium mb-2 block text-gray-700">Google Calendar / Calendly Link (optional)</label>
              <input type="url" name="calendarLink" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" placeholder="Paste your booking link" />
            </div>
          </div>

          {/* 7. Account Setup */}
          <div className="section-card bg-white rounded-3xl p-7 mb-8 shadow-md border border-gray-200">
            <h2 className="section-title text-2xl font-bold mb-4 text-[#1e1e1e] border-l-4 border-yellow-400 pl-4">Dashboard Account</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Admin Email (for dashboard login) <span className="text-red-500">*</span></label>
                <input type="email" name="adminEmail" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Admin Name (full name) <span className="text-red-500">*</span></label>
                <input type="text" name="adminName" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Password <span className="text-red-500">*</span></label>
                <input type="password" name="password" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" />
              </div>
              <div>
                <label className="form-label font-medium mb-2 block text-gray-700">Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-input w-full p-3 border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition" />
              </div>
            </div>
          </div>

          {/* Submit Section with note */}
          <div className="text-center">
            <button type="submit" className="btn-submit bg-[#1e1e1e] text-white p-4 rounded-full font-semibold w-full transition hover:bg-yellow-400 hover:text-black">Submit Application <i className="fas fa-arrow-right ml-2"></i></button>
            <p className="text-sm text-gray-500 mt-4">The entire process will take 2‑3 days. Once completed, BURG will inform you at the given email.</p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>© 2026 BURG InvestDecide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ListYourFirmPage;
