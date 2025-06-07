import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['IT', 'NON-IT'],
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    positionType: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Contract'],
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyOverview: {
        type: String,
        required: true,
    },
    positionSummary: {
        type: String,
        required: true,
    },
    keyResponsibilities: {
        type: [String],
        required: true,
        validate: [(arr) => arr.length >= 1, '{PATH} must have at least 1 item'],
    },
    education: {
        type: [String],
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    languages: {
        type: [String],
        default: [],
    },
    frameworks: {
        type: [String],
        default: [],
    },
    databases: {
        type: [String],
        default: [],
    },
    methodologies: {
        type: [String],
        default: [],
    },
    softSkills: {
        type: [String],
        required: true,
    },
    preferredQualifications: {
        type: [String],
        default: [],
    },
    startDate: {
        type: String,
        required: false,
    },
    applicationDeadline: {
        type: String,
        required: false,
    },
    benefits: {
        type: [String],
        required: true,
    },
    submissionMethod: {
        type: String,
        enum: ['email', 'portal'],
        required: true,
    },
    contactEmail: {
        type: String,
        required: function () {
            return this.submissionMethod === 'email';
        },
    },
    applicationPortalLink: {
        type: String,
        required: function () {
            return this.submissionMethod === 'portal';
        },
    },
    jobReferenceNumber: {
        type: String,
        required: false,
    },
    equalOpportunityStatement: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const JobModel = mongoose.models.Job || mongoose.model('Job', jobPostingSchema);

export const Job = JobModel;
