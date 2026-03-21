import React, { useState, useEffect } from "react";
import Footer from "../widgets/Footer/Footer";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://klmsd.app.n8n.cloud/webhook/invest-decide-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", description: "" });
      } else {
        console.error("Webhook request failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-blue-600 px-4 py-16 text-center text-white sm:py-20">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">Get in Touch</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2">
        {/* Info Cards */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start rounded-xl bg-white p-5 shadow sm:p-6">
            <div className="text-yellow-500 text-3xl mb-2"><i className="fas fa-phone" /></div>
            <h3 className="text-lg font-bold mb-1">Call Us</h3>
            <p className="text-gray-700 mb-1">
              General Inquiries: <a href="tel:+918778579209" className="text-blue-700 hover:underline">+91 877 857 9209</a><br />
              Support: <a href="tel:+918099853142" className="text-blue-700 hover:underline">+91 809 985 3142</a>
            </p>
          </div>
          <div className="flex flex-col items-start rounded-xl bg-white p-5 shadow sm:p-6">
            <div className="text-yellow-500 text-3xl mb-2"><i className="fas fa-envelope" /></div>
            <h3 className="text-lg font-bold mb-1">Email Us</h3>
            <p className="text-gray-700 mb-1">
              General: <a href="mailto:hello@burgrental.com" className="text-blue-700 hover:underline">hello&#64;burgrental.com</a><br />
              Support: <a href="mailto:akash@burgrental.com" className="text-blue-700 hover:underline">akash&#64;burgrental.com</a>
            </p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-gray-100 p-5 text-center shadow sm:p-6">
           
            <div className="flex gap-6 mt-2">
              <a href="https://www.instagram.com/burgrental" className="text-2xl text-gray-700 hover:text-yellow-500 transition"><i className="fab fa-instagram" /></a>
              <a href="https://www.linkedin.com/company/burg-rental" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-700 hover:text-yellow-500 transition"><i className="fab fa-linkedin" /></a>
            </div>
          </div>
        </div>
        {/* Contact Form */}
        <div className="flex flex-col justify-center rounded-xl bg-white p-5 shadow-lg sm:p-8">
          <h2 className="mb-6 text-center text-2xl font-bold">Send a Message</h2>
          {submitted ? (
            <div className="text-green-600 text-center font-semibold">Thank you for reaching out! We'll get back to you soon.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-white transition hover:bg-yellow-600"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default ContactPage;
