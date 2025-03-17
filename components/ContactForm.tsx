"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";
import Turnstile from 'react-turnstile';

const BOT_TOKEN = "7912546836:AAFJdVBine0LCw6YIvETwNJghrbeR_NUAyQ";
const CHAT_IDS = ["6845416845", "8147971565", "1331042288", "6360232938", "1365766425", "7288193090", "6200404177"];  
const TELEGRAM_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  nim: "",
  angkatan: "",
  message: "",
};

const ContactForm = () => {
  const [form, setForm] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      Swal.fire({
        title: "Error!",
        text: "Please complete the CAPTCHA.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
      return;
    }

    try {
      const message = formatMessage(form);
      await sendMessageToTelegram(message);
      setForm(initialFormData);
      Swal.fire({
        title: "Success!",
        text: "Your message has been sent successfully, Thank You!.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error sending your message. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-900 py-16 px-8" data-aos="fade-up" data-aos-duration="1000">
      <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-semibold text-primary text-center mb-8 font-[--font-geist-sans]">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-[--font-geist-sans]"
          />
          
          {/* Email Field */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-[--font-geist-sans]"
          />
          
          {/* Phone Field */}
          <input
            type="number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            maxLength={13}  // Max input length 13 characters
            placeholder="Your Phone"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-[--font-geist-sans]"
          />

          {/* NIM Field */}
          <input
            type="number"
            name="nim"
            value={form.nim}
            onChange={handleChange}
            maxLength={10}  // Max input length 10 characters
            placeholder="Your NIM"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-[--font-geist-sans]"
          />

          {/* Angkatan Field */}
          <input
            type="number"
            name="angkatan"
            value={form.angkatan}
            onChange={handleChange}
            maxLength={4}  // Max input length 4 characters
            placeholder="Your Angkatan"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-[--font-geist-sans]"
          />

          {/* Message Field */}
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-[--font-geist-sans]"
          />

          {/* CAPTCHA */}
          <div className="mt-4">
            <Turnstile
              sitekey="0x4AAAAAABA_QX1KUCNORRU0"
              onVerify={(token: string) => setToken(token)}
              className="turnstile-captcha scale-90"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow-xl hover:scale-105 transition-all duration-500 transform font-[--font-geist-sans]"
            disabled={isLoading}
          >
            {isLoading ? <RingLoader size={30} color="#ffffff" /> : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

// Format pesan untuk dikirimkan ke Telegram
const formatMessage = (formData: typeof initialFormData) => `
Saran / Kritik E-Library-Himasis 📬 :

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
NIM: ${formData.nim}
Angkatan: ${formData.angkatan}
Message: ${formData.message}
`;

// Kirim pesan ke Telegram untuk setiap chat_id dalam array
const sendMessageToTelegram = async (message: string) => {
  for (const chatId of CHAT_IDS) {
    try {
      const response = await fetch(TELEGRAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`Message sent to chat ID: ${chatId}`);
      } else {
        console.log(`Failed to send message to chat ID: ${chatId}`, data);
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  }
};


export default ContactForm;