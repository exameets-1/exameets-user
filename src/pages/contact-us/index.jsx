'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// In Next.js, we use hooks differently
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};


//Test Me -> Feedback Form

const ContactUs = () => {
    useScrollToTop();

    useEffect(() => {
        // Next.js uses process.env instead of import.meta.env
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        suggestion: '',
        screenshot: null
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_NAME);

        try {
            const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`;
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to upload image');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // In your handleSubmit function:

try {
    let screenshotUrl = '';
    if (formData.screenshot) {
        // Check file size before uploading
        if (formData.screenshot.size > 5 * 1024 * 1024) { // 5MB limit
            setMessage('Image is too large. Please use an image under 5MB.');
            setLoading(false);
            return;
        }
        
        try {
            screenshotUrl = await uploadToCloudinary(formData.screenshot);
        } catch (error) {
            setMessage('Failed to upload image. Please try again or submit without an image.');
            setLoading(false);
            return;
        }
    }

    const templateParams = {
        name: formData.name,
        email: formData.email || 'Not provided',
        suggestion: formData.suggestion,
        screenshot: screenshotUrl || ''
    };

    const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams
    );

    if (response.status === 200) {
        setMessage('Thank you for your feedback!');
        setFormData({
            name: '',
            email: '',
            suggestion: '',
            screenshot: null
        });
        // Clear the file input
        const fileInput = document.getElementById('screenshot');
        if (fileInput) fileInput.value = '';
    }
} catch (error) {

    setMessage(`Failed to send message: ${error.message || 'Unknown error'}`);
} finally {
    setLoading(false);
}
    };

    return (
        <div className="p-5 max-w-[1200px] mx-auto">
          {/* Introduction Section */}
          <section className="bg-white dark:bg-gray-800 p-5 md:p-8 rounded-lg shadow-md mb-10">
            <h2 className="text-[#015990] dark:text-blue-300 text-3xl md:text-4xl text-center mb-5 font-bold">
              We&apos;re here to help!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl text-center mb-6">
              If you have any questions, feedback, or inquiries, feel free to reach out to us. 
              We&apos;d love to hear from you.
            </p>
            
            <h3 className="text-gray-800 dark:text-gray-200 text-2xl font-semibold mb-4">Contact us at:</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-3">
              <strong>Email:</strong>{' '}
              <a href="mailto:exameets@gmail.com" className="text-[#015990] dark:text-blue-400 hover:underline">
                exameets@gmail.com
              </a>
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              <strong>Phone:</strong>{' '}
              <a href="tel:+916302089490" className="text-[#015990] dark:text-blue-400 hover:underline">
                +91 6302089490
              </a>
            </p>
            
            <hr className="my-6 border-t border-gray-300 dark:border-gray-600" />
            
            <h3 className="text-gray-800 dark:text-gray-200 text-2xl font-semibold mb-4">Office Address:</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Exameets HQ (Mon - Fri, 9 AM - 6 PM)<br />
              Kadapa,<br />
              Andhra Pradesh,<br />
              India - 516003.
            </p>
          </section>
      
          {/* Suggestions Section */}
          <section className="bg-white dark:bg-gray-800 p-5 md:p-8 rounded-lg shadow-md">
            <h2 className="text-[#015990] dark:text-blue-300 text-3xl md:text-4xl text-center mb-5 font-bold">
              Your Feedback Matters!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl text-center mb-8">
              At Exameets, we continuously strive to improve and offer the best experience 
              for students, job seekers, and exam aspirants. We value your feedback and 
              suggestions.
            </p>
            
            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-lg text-center ${
                  message.includes('Failed') 
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700'
                }`}>
                  {message}
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="name" className="block text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#015990] dark:focus:ring-blue-400 focus:border-[#015990] dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="(Optional)"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#015990] dark:focus:ring-blue-400 focus:border-[#015990] dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="suggestion" className="block text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Your Suggestion: <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="suggestion"
                  name="suggestion"
                  placeholder="Tell us what you think!"
                  rows="4"
                  value={formData.suggestion}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#015990] dark:focus:ring-blue-400 focus:border-[#015990] dark:focus:border-blue-400 resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                />
              </div>
      
              <div className="mb-8">
                <label htmlFor="screenshot" className="block text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Upload Screenshot (optional):
                </label>
                <input
                  type="file"
                  id="screenshot"
                  name="screenshot"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#015990] dark:file:bg-blue-500 file:text-white hover:file:bg-[#014570] dark:hover:file:bg-blue-400 cursor-pointer"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#015990] dark:bg-blue-500 text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-[#014570] dark:hover:bg-blue-400 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Submit Feedback'}
              </button>
            </form>
          </section>
        </div>
    );
};

export default ContactUs;