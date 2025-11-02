import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { sendSms, makeCall } from '../services/twilioService.js';
import User from '../models/User.js'; // Import User model
import config from '../config/config.js'; // Import config

// @desc    Get all appointments (Admin/Doctor only)
// @route   GET /api/appointments
// @access  Private/Admin or Doctor
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('patient', 'patientId dob gender bloodGroup isPremium user')
    .populate('doctor', 'specialty qualifications averageRating numberOfReviews user')
    .populate('hospital', 'name location');

  res.json(appointments);
});

// @desc    Get appointments for the logged-in user (Patient, Doctor, Admin)
// @route   GET /api/appointments/myappointments
// @access  Private
const getMyAppointments = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) {
            res.status(404);
            throw new Error('Patient profile not found');
        }
        
        // Get primary patient ID
        const primaryPatientId = patient._id;
        
        // Find all family members (patients with this primaryPatientId)
        const familyMembers = await Patient.find({ primaryPatient: primaryPatientId }).select('_id');
        const familyMemberIds = familyMembers.map(fm => fm._id);
        
        // Include both primary patient and family member appointments
        query = { 
            patient: { $in: [primaryPatientId, ...familyMemberIds] }
        };
    } else if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            res.status(404);
            throw new Error('Doctor profile not found');
        }
        query = { doctor: doctor._id };
    }
    // Admins can see all appointments (no specific query needed for admin, already covered by getAppointments if not filtered)

    const appointments = await Appointment.find(query)
      .populate('patient', 'patientId name profilePicture dob gender bloodGroup isPremium user primaryPatient')
      .populate({
        path: 'doctor',
        select: 'specialty qualifications averageRating numberOfReviews user',
        populate: {
          path: 'user',
          select: 'name profilePicture'
        }
      })
      .populate('hospital', 'name location')
      .sort({ date: -1, time: -1 }); // Sort by date and time descending

    res.json(appointments);
});

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private/Admin, Doctor or Patient
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'patientId dob gender bloodGroup isPremium user')
    .populate('doctor', 'specialty qualifications averageRating numberOfReviews user')
    .populate('hospital', 'name location');

  if (appointment) {
    // Authorization: Only admin, the patient who made the appointment, or the doctor for the appointment can view
    const isAuthorized = req.user.role === 'Admin' || 
                         (appointment.patient && appointment.patient.user && appointment.patient.user.toString() === req.user._id.toString()) ||
                         (appointment.doctor && appointment.doctor.user && appointment.doctor.user.toString() === req.user._id.toString());

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view this appointment');
    }

    res.json(appointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Create an appointment (Patient only)
// @route   POST /api/appointments
// @access  Private/Patient
const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, hospitalId, date, time, reason, specialty, forFamilyMemberId } = req.body; // Added forFamilyMemberId

  let patientToBook;

  if (forFamilyMemberId) {
    // Find the family member patient
    const familyMember = await Patient.findById(forFamilyMemberId);
    if (!familyMember) {
      res.status(404);
      throw new Error('Family member patient profile not found');
    }

    // Verify that this family member belongs to the logged-in user's primary patient
    const primaryUser = await User.findById(req.user._id); // Logged-in user
    if (!primaryUser || !primaryUser.patient) {
      res.status(404);
      throw new Error('Primary patient profile not found for this user');
    }

    // Ensure the found family member's primaryPatient field matches the logged-in user's primary patient ID
    // Or, ensure family member's user ID matches the logged-in user ID (if family members are directly linked to user, which they are now).
    if (familyMember.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to book for this family member');
    }
    patientToBook = familyMember;

  } else {
    // Default to the logged-in user's patient profile
    const primaryPatient = await Patient.findOne({ user: req.user._id });
    if (!primaryPatient) {
      res.status(404);
      throw new Error('Patient profile not found');
    }
    patientToBook = primaryPatient;
  }
  
  let doctorToBook;
  if (doctorId === 'first_available') {
      // Find an available doctor for the given hospital, specialty, date, and time
      const availableDoctors = await Doctor.find({
          hospital: hospitalId,
          specialty: specialty,
          isAvailable: true,
      }).populate('user');

      if (availableDoctors.length === 0) {
          res.status(400);
          throw new Error('No doctors available for this specialty at this hospital.');
      }

      // For simplicity, pick the first available doctor from the list
      // More sophisticated logic might involve checking individual doctor schedules for the exact slot
      doctorToBook = availableDoctors[0];
  } else {
      doctorToBook = await Doctor.findById(doctorId).populate('user');
  }

  if (!doctorToBook) {
      res.status(404);
      throw new Error('Doctor not found');
  }

  // Basic check for doctor availability (more complex logic would be needed here)
  if (!doctorToBook.isAvailable) {
      res.status(400);
      throw new Error('Doctor is not available for appointments');
  }

  // Check for existing appointments at the same time for the doctor and hospital
  const existingAppointment = await Appointment.findOne({ doctor: doctorToBook._id, hospital: hospitalId, date, time, status: { $ne: 'Cancelled' } });
  if (existingAppointment) {
    res.status(400);
    throw new Error('Doctor already has an appointment at this time in this hospital');
  }

  // Generate token number (simple sequential for the day, per doctor and hospital)
  const appointmentsToday = await Appointment.countDocuments({ doctor: doctorToBook._id, hospital: hospitalId, date: new Date(date), status: { $ne: 'Cancelled' } });
  const tokenNumber = (appointmentsToday + 1).toString();

  const appointment = new Appointment({
    patient: patientToBook._id,
    doctor: doctorToBook._id,
    hospital: hospitalId,
    date,
    time,
    reason,
    status: 'Pending',
    tokenNumber, // Assign generated token number
  });

  const createdAppointment = await appointment.save();

  // Notify doctor and patient (using Twilio for SMS)
  // if (patient.user && patient.user.phoneNumber) {
  //     const patientUser = await User.findById(patient.user);
  //     if (patientUser && patientUser.phoneNumber) {
  //       const msg = `Hello ${patientUser.name}, your appointment with Dr. ${doctorToBook.user.name} on ${new Date(date).toDateString()} at ${time} is pending confirmation. Your token number is ${tokenNumber}.`;
  //       sendSms(patientUser.phoneNumber, msg);
  //     }
  // }
  // if (doctorToBook.user && doctorToBook.user.phoneNumber) {
  //     const doctorUser = await User.findById(doctorToBook.user);
  //     if (doctorUser && doctorUser.phoneNumber) {
  //       const msg = `Hello Dr. ${doctorUser.name}, a new appointment request from ${patient.user.name} on ${new Date(date).toDateString()} at ${time} is pending. Token: ${tokenNumber}.`;
  //       sendSms(doctorUser.phoneNumber, msg);
  //     }
  // }

  // Schedule Twilio call for patient 10 minutes before appointment
  const appointmentDateTime = new Date(`${date}T${time}:00`);
  const tenMinutesBeforeAppointment = new Date(appointmentDateTime.getTime() - 10 * 60 * 1000);
  const currentTime = new Date();

  const delay = tenMinutesBeforeAppointment.getTime() - currentTime.getTime();

  if (delay > 0 && patientToBook.user) { // Only schedule call if delay is positive and patient user exists
      const patientUser = await User.findById(patientToBook.user);
      if (patientUser && patientUser.phoneNumber) {
          console.log("createAppointment: Patient User Found, phoneNumber:", patientUser.phoneNumber); // NEW LOG
          console.log("createAppointment: TwiML URL for call:", config.twilio.recordedCallUrl); // NEW LOG
          console.log("Attempting to schedule Twilio call for patient:", patientUser.phoneNumber);
          console.log("Call scheduled in", delay / 1000, "seconds"); // Log the delay in seconds
          setTimeout(async () => {
              try {
                  await makeCall(patientUser.phoneNumber, config.twilio.recordedCallUrl);
              } catch (err) {
                  console.error("Error making scheduled call:", err);
                  // Don't throw - just log the error to prevent app crashes
              }
          }, delay);
      }
  }

  // Create notifications for patient and doctor
  await Notification.create({
      recipient: patientToBook._id,
      onModel: 'Patient',
      title: 'Appointment Created',
      message: `Your appointment for ${patientToBook.name} with Dr. ${doctorToBook.user.name} on ${new Date(date).toDateString()} at ${time} is pending. Your token number is ${tokenNumber}.`,
      category: 'Appointment',
      link: `/patient/appointments/${createdAppointment._id}`,
  });

  await Notification.create({
      recipient: doctorToBook._id,
      onModel: 'Doctor',
      title: 'New Appointment Request',
      message: `New appointment request from ${patientToBook.name} (ID: ${patientToBook.patientId}) on ${new Date(date).toDateString()} at ${time}. Token: ${tokenNumber}.`,
      category: 'Appointment',
      link: `/doctor/appointments/${createdAppointment._id}`,
  });

  res.status(201).json(createdAppointment);
});

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private/Admin, Doctor or Patient
const updateAppointment = asyncHandler(async (req, res) => {
  const { date, time, reason, status, tokenNumber } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Authorization: Only admin, the patient who made the appointment, or the doctor for the appointment can update
    const patient = await Patient.findById(appointment.patient).select('user');
    const doctor = await Doctor.findById(appointment.doctor).select('user');
    
    const isAuthorized = req.user.role === 'Admin' || 
                         (patient && patient.user && patient.user.toString() === req.user._id.toString()) ||
                         (doctor && doctor.user && doctor.user.toString() === req.user._id.toString());
    
    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to update this appointment');
    }

    // Store old status before updating
    const oldStatus = appointment.status;
    
    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.reason = reason || appointment.reason;
    if (status) {
        appointment.status = status;
    }
    appointment.tokenNumber = tokenNumber || appointment.tokenNumber;

    const updatedAppointment = await appointment.save();

    // Notify parties about status change - always notify both patient and doctor
    if (status && status !== oldStatus) {
        const patient = await Patient.findById(updatedAppointment.patient);
        const doctor = await Doctor.findById(updatedAppointment.doctor);

        // Notify patient
        if (patient && patient.user) {
            const patientUser = await User.findById(patient.user);
            if (patientUser) {
                if (patientUser.phoneNumber) {
                    const doctorUser = await User.findById(doctor.user);
                    const msg = `Hello ${patientUser.name}, your appointment with Dr. ${doctorUser?.name || 'your doctor'} on ${new Date(updatedAppointment.date).toDateString()} at ${updatedAppointment.time} has been ${updatedAppointment.status}.`;
                    // Send SMS (won't crash if it fails - sendSms handles errors gracefully)
                    sendSms(patientUser.phoneNumber, msg).catch(err => {
                        console.error('Failed to send SMS to patient:', err);
                    });
                }
                const doctorUser = await User.findById(doctor.user);
                await Notification.create({
                    recipient: patient._id,
                    onModel: 'Patient',
                    title: 'Appointment Status Update',
                    message: `Your appointment with Dr. ${doctorUser?.name || 'your doctor'} on ${new Date(updatedAppointment.date).toDateString()} at ${updatedAppointment.time} is now ${updatedAppointment.status}.`,
                    category: 'Appointment',
                    link: `/patient/appointments/${updatedAppointment._id}`,
                });
            }
        }

        // Notify doctor - always notify when status changes, regardless of who made the change
        if (doctor && doctor.user) {
            const doctorUser = await User.findById(doctor.user);
            if (doctorUser) {
                const patientName = patient?.name || 'Patient';
                const patientId = patient?.patientId || 'N/A';
                
                if (doctorUser.phoneNumber) {
                    const msg = `Hello Dr. ${doctorUser.name}, the appointment for ${patientName} (ID: ${patientId}) on ${new Date(updatedAppointment.date).toDateString()} at ${updatedAppointment.time} has been ${updatedAppointment.status}.`;
                    // Send SMS (won't crash if it fails - sendSms handles errors gracefully)
                    sendSms(doctorUser.phoneNumber, msg).catch(err => {
                        console.error('Failed to send SMS to doctor:', err);
                    });
                }
                await Notification.create({
                    recipient: doctor._id,
                    onModel: 'Doctor',
                    title: 'Appointment Status Update',
                    message: `Appointment for ${patientName} (ID: ${patientId}) on ${new Date(updatedAppointment.date).toDateString()} at ${updatedAppointment.time} is now ${updatedAppointment.status}.`,
                    category: 'Appointment',
                    link: `/doctor/appointments/${updatedAppointment._id}`,
                });
            }
        }
    }

    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin or Doctor
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

export { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getMyAppointments };
