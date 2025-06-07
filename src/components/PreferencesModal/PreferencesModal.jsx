'use client'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePreferences } from '@/store/slices/userSlice';
import { toast } from 'react-toastify';
import styles from './PreferencesModal.module.css';

const PreferencesModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        notifications_about: '',
        isStudying: '',
        educationLevel: '',
        governmentJobType: '',
        techJobCategory: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
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

    return (
        <div className={styles.preferencesModalOverlay}>
            <div className={styles.preferencesModal}>
                <div className={styles.contentContainer}>
                    <h1 className={styles.heading}>Get Notifications & Prepare</h1>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="notifications_about">Select Exams/Jobs for Notifications</label>
                            <select 
                                id="notifications_about"
                                name="notifications_about"
                                value={formData.notifications_about}
                                onChange={handleChange}
                                className={styles.selectType}
                                required
                            >
                                <option value="">Select your preference</option>
                                <option value="govtjobs">Government Jobs</option>
                                <option value="techjobs">Tech Jobs</option>
                                <option value="internships">Internships</option>
                                <option value="admissions">Admissions</option>
                                <option value="scholarships">Scholarships</option>
                                <option value="results">Results</option>
                            </select>
                        </div>

                        {/* Government Job Type dropdown - only shown when Government Jobs is selected */}
                        {formData.notifications_about === 'govtjobs' && (
                            <div className={styles.formGroup}>
                                <label htmlFor="governmentJobType">Select Your Job Type (Government Job)</label>
                                <select
                                    id="governmentJobType"
                                    name="governmentJobType"
                                    value={formData.governmentJobType}
                                    onChange={handleChange}
                                    className={styles.selectType}
                                    required
                                >
                                    <option value="">Select government job type</option>
                                    <option value="UPSC">UPSC (Union Public Service Commission)</option>
                                    <option value="SSC (Staff Selection Commission)">SSC (Staff Selection Commission)</option>
                                    <option value="IBPS and Banking Jobs">IBPS and Banking Jobs</option>
                                    <option value="Teaching and Academia">Teaching and Academia</option>
                                    <option value="Railway Recruitment">Railway Recruitment</option>
                                    <option value="Defense and Paramilitary">Defense and Paramilitary</option>
                                    <option value="State Government Jobs">State Government Jobs</option>
                                    <option value="Public Sector Undertakings (PSUs)">Public Sector Undertakings (PSUs)</option>
                                    <option value="Medical Sector">Medical Sector</option>
                                    <option value="Judiciary and Legal Services">Judiciary and Legal Services</option>
                                    <option value="Insurance Sector Jobs">Insurance Sector Jobs</option>
                                    <option value="Teaching & Research">Teaching & Research</option>
                                    <option value="Post Office Jobs">Post Office Jobs</option>
                                    <option value="Agriculture and Rural Development">Agriculture and Rural Development</option>
                                    <option value="Indian Railways">Indian Railways</option>
                                    <option value="Defense Research and Development">Defense Research and Development</option>
                                    <option value="Law and Judiciary">Law and Judiciary</option>
                                    <option value="Environment and Forest Services">Environment and Forest Services</option>
                                    <option value="Economic and Statistical Services">Economic and Statistical Services</option>
                                    <option value="Media and Communication">Media and Communication</option>
                                    <option value="Public Sector Energy Companies">Public Sector Energy Companies</option>
                                    <option value="Social and Welfare Sector">Social and Welfare Sector</option>
                                    <option value="Customs and Excise">Customs and Excise</option>
                                    <option value="Taxation Services">Taxation Services</option>
                                    <option value="Cooperative Sector Jobs">Cooperative Sector Jobs</option>
                                    <option value="Transport and Civil Aviation">Transport and Civil Aviation</option>
                                    <option value="Tourism and Hospitality">Tourism and Hospitality</option>
                                    <option value="Cultural and Heritage Jobs">Cultural and Heritage Jobs</option>
                                    <option value="Science and Technology">Science and Technology</option>
                                    <option value="Meteorological Department Jobs">Meteorological Department Jobs</option>
                                </select>
                            </div>
                        )}

                        {/* Tech Jobs Category dropdown - only shown when Tech Jobs is selected */}
                        {formData.notifications_about === 'techjobs' && (
                            <div className={styles.formGroup}>
                                <label htmlFor="techJobCategory">Select Tech Job Category</label>
                                <select
                                    id="techJobCategory"
                                    name="techJobCategory"
                                    value={formData.techJobCategory}
                                    onChange={handleChange}
                                    required
                                    className={styles.selectType}
                                >
                                    <option value="">Select category</option>
                                    <option value="IT">IT</option>
                                    <option value="NON-IT">NON-IT</option>
                                </select>
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="isStudying">Are you currently studying?</label>
                            <select
                                id="isStudying"
                                name="isStudying"
                                value={formData.isStudying}
                                onChange={handleChange}
                                required
                                className={styles.selectType}
                            >
                                <option value="">Select an option</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="educationLevel">Education Level</label>
                            <select
                                id="educationLevel"
                                name="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleChange}
                                required
                                className={styles.selectType}
                            >
                                <option value="">Select your education level</option>
                                <option value="high-school">High School</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="postgraduate">Postgraduate</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <button type="submit" className={styles.submitBtn}>Done</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PreferencesModal;