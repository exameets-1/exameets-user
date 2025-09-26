import { Employee } from "@/lib/models/Employee";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const { slug } = req.query;

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Connect to database
    await dbConnect();

    // Find employee by empId (case insensitive)
    const employee = await Employee.findOne({ 
      empId: slug.toUpperCase(),
      active: true // Only show active employees on public pages
    }).select({
      // Include only public, non-sensitive information for digital ID card
      empId: 1,
      name: 1,
      photoUrl: 1,
      role: 1,
      department: 1,
      active: 1,
      createdAt: 1,
      _id: 1
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found or inactive'
      });
    }

    // Return public employee data
    res.status(200).json({
      success: true,
      employee: {
        empId: employee.empId,
        name: employee.name,
        photoUrl: employee.photoUrl,
        role: employee.role,
        department: employee.department || 'Not specified',
        joinDate: employee.createdAt,
        status: 'Active'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}