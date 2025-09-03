'use client'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePreferences } from '@/store/slices/userSlice';
import { toast } from 'react-toastify';
import CustomSelect from '../CustomSelect/CustomSelect';

const PreferencesModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        notifications_about: '',
        isStudying: '',
        educationLevel: '',
        governmentJobType: '',
        techJobCategory: ''
    });

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset dependent fields when parent selection changes
            ...(name === 'notifications_about' && value !== 'govtjobs' ? { governmentJobType: '' } : {}),
            ...(name === 'notifications_about' && value !== 'techjobs' ? { techJobCategory: '' } : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert isStudying to boolean and prepare preferences
        const preferences = {
            ...formData,
            isStudying: formData.isStudying === 'yes',
            preferencesSet: true,
            // If government jobs is selected, use the specific job type
            // If tech jobs is selected, use the tech category (IT/NON-IT)
            notifications_about: formData.notifications_about === 'govtjobs' 
                ? formData.governmentJobType 
                : formData.notifications_about === 'techjobs'
                    ? formData.techJobCategory
                    : formData.notifications_about
        };

        try {
            const result = await dispatch(updatePreferences(preferences)).unwrap();
            toast.success('Preferences updated successfully!');
            onClose();
        } catch (error) {
            console.error('Failed to update preferences:', error);
            toast.error(error || 'Failed to update preferences');
        }
    };

    // Options for all select components
    const notificationOptions = [
        { value: 'govtjobs', label: 'Government Jobs' },
        { value: 'techjobs', label: 'Tech Jobs' },
        { value: 'internships', label: 'Internships' },
        { value: 'admissions', label: 'Admissions' },
        { value: 'scholarships', label: 'Scholarships' },
        { value: 'results', label: 'Results' }
    ];

    const governmentJobOptions = [
        { value: 'UPSC', label: 'UPSC (Union Public Service Commission)' },
        { value: 'SSC (Staff Selection Commission)', label: 'SSC (Staff Selection Commission)' },
        { value: 'IBPS and Banking Jobs', label: 'IBPS and Banking Jobs' },
        { value: 'Teaching and Academia', label: 'Teaching and Academia' },
        { value: 'Railway Recruitment', label: 'Railway Recruitment' },
        { value: 'Defense and Paramilitary', label: 'Defense and Paramilitary' },
        { value: 'State Government Jobs', label: 'State Government Jobs' },
        { value: 'Public Sector Undertakings (PSUs)', label: 'Public Sector Undertakings (PSUs)' },
        { value: 'Medical Sector', label: 'Medical Sector' },
        { value: 'Judiciary and Legal Services', label: 'Judiciary and Legal Services' },
        { value: 'Insurance Sector Jobs', label: 'Insurance Sector Jobs' },
        { value: 'Teaching & Research', label: 'Teaching & Research' },
        { value: 'Post Office Jobs', label: 'Post Office Jobs' },
        { value: 'Agriculture and Rural Development', label: 'Agriculture and Rural Development' },
        { value: 'Indian Railways', label: 'Indian Railways' },
        { value: 'Defense Research and Development', label: 'Defense Research and Development' },
        { value: 'Law and Judiciary', label: 'Law and Judiciary' },
        { value: 'Environment and Forest Services', label: 'Environment and Forest Services' },
        { value: 'Economic and Statistical Services', label: 'Economic and Statistical Services' },
        { value: 'Media and Communication', label: 'Media and Communication' },
        { value: 'Public Sector Energy Companies', label: 'Public Sector Energy Companies' },
        { value: 'Social and Welfare Sector', label: 'Social and Welfare Sector' },
        { value: 'Customs and Excise', label: 'Customs and Excise' },
        { value: 'Taxation Services', label: 'Taxation Services' },
        { value: 'Cooperative Sector Jobs', label: 'Cooperative Sector Jobs' },
        { value: 'Transport and Civil Aviation', label: 'Transport and Civil Aviation' },
        { value: 'Tourism and Hospitality', label: 'Tourism and Hospitality' },
        { value: 'Cultural and Heritage Jobs', label: 'Cultural and Heritage Jobs' },
        { value: 'Science and Technology', label: 'Science and Technology' },
        { value: 'Meteorological Department Jobs', label: 'Meteorological Department Jobs' }
    ];

    const techJobOptions = [
        { value: 'IT', label: 'IT' },
        { value: 'NON-IT', label: 'NON-IT' }
    ];

    const studyingOptions = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
    ];

    const educationOptions = [
        { value: 'high-school', label: 'High School' },
        { value: 'undergraduate', label: 'Undergraduate' },
        { value: 'postgraduate', label: 'Postgraduate' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-lg w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-5">
                    <h1 className="text-center text-[#015990] dark:text-blue-400 text-xl md:text-2xl font-bold mb-5">
                        Get Notifications & Prepare
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <CustomSelect
                                id="notifications_about"
                                name="notifications_about"
                                label="Select Exams/Jobs for Notifications"
                                options={notificationOptions}
                                value={formData.notifications_about}
                                onChange={(value) => handleChange('notifications_about', value)}
                                placeholder="Select your preference"
                                required={true}
                                className="mb-0"
                            />
                        </div>

                        {/* Government Job Type dropdown - only shown when Government Jobs is selected */}
                        {formData.notifications_about === 'govtjobs' && (
                            <div className="mb-5">
                                <CustomSelect
                                    id="governmentJobType"
                                    name="governmentJobType"
                                    label="Select Your Job Type (Government Job)"
                                    options={governmentJobOptions}
                                    value={formData.governmentJobType}
                                    onChange={(value) => handleChange('governmentJobType', value)}
                                    placeholder="Select government job type"
                                    required={true}
                                    className="mb-0"
                                />
                            </div>
                        )}

                        {/* Tech Jobs Category dropdown - only shown when Tech Jobs is selected */}
                        {formData.notifications_about === 'techjobs' && (
                            <div className="mb-5">
                                <CustomSelect
                                    id="techJobCategory"
                                    name="techJobCategory"
                                    label="Select Tech Job Category"
                                    options={techJobOptions}
                                    value={formData.techJobCategory}
                                    onChange={(value) => handleChange('techJobCategory', value)}
                                    placeholder="Select category"
                                    required={true}
                                    className="mb-0"
                                />
                            </div>
                        )}

                        <div className="mb-5">
                            <CustomSelect
                                id="isStudying"
                                name="isStudying"
                                label="Are you currently studying?"
                                options={studyingOptions}
                                value={formData.isStudying}
                                onChange={(value) => handleChange('isStudying', value)}
                                placeholder="Select an option"
                                required={true}
                                className="mb-0"
                            />
                        </div>

                        <div className="mb-5">
                            <CustomSelect
                                id="educationLevel"
                                name="educationLevel"
                                label="Education Level"
                                options={educationOptions}
                                value={formData.educationLevel}
                                onChange={(value) => handleChange('educationLevel', value)}
                                placeholder="Select your education level"
                                required={true}
                                className="mb-0"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 mt-6 mb-2 bg-gradient-to-r from-[#015990] to-[#0177b7] dark:from-blue-600 dark:to-blue-500 text-white font-semibold text-base md:text-lg rounded-xl shadow-lg transition-all duration-200 hover:from-[#0177b7] hover:to-[#015990] dark:hover:from-blue-500 dark:hover:to-blue-600 hover:-translate-y-0.5 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#015990] dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            Done
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PreferencesModal;