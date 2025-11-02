import React, { useState, useEffect } from 'react'; // NEW: Import useState and useEffect
import { User, Mail, Phone, Building, MapPin, FlaskConical, PlusCircle, Trash2 } from 'lucide-react'; // NEW: Import FlaskConical, PlusCircle, Trash2
import { motion } from 'framer-motion'; // NEW: Import motion
import api from '../../utils/api'; // NEW: Import api
import { useAuth } from '../../context/AuthContext'; // NEW: Import useAuth
import { toast } from 'react-toastify'; // NEW: Import toast for notifications

const LabProfilePage = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [labProfile, setLabProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  // State for editable fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [testsOffered, setTestsOffered] = useState([]); // NEW: State for tests offered
  const [newTest, setNewTest] = useState({
    testName: '', testType: '', price: 0
  }); // NEW: State for new test input

  useEffect(() => {
    const fetchLabProfile = async () => {
      if (!user || !user.lab || !user.lab._id) {
        setError('User not authorized or lab ID not found.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/api/labs/profile/${user.lab._id}`);
        const fetchedProfile = response.data;
        setLabProfile(fetchedProfile);
        // Initialize edit states with fetched data
        setName(fetchedProfile.name || '');
        setEmail(fetchedProfile.email || '');
        setPhone(fetchedProfile.phone || '');
        setAddress(fetchedProfile.address || '');
        setWebsite(fetchedProfile.website || '');
        setTestsOffered(fetchedProfile.testsOffered || []); // NEW: Initialize testsOffered

      } catch (err) {
        console.error('Failed to fetch lab profile:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch lab profile');
        toast.error('Failed to load lab profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchLabProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      const updatedData = {
        name,
        email,
        phone,
        address,
        website,
        testsOffered, // NEW: Include testsOffered in updated data
      };
      const response = await api.put(`/api/labs/profile/${user.lab._id}`, updatedData);
      setLabProfile(response.data); // Update local state with updated profile from backend
      toast.success('Profile updated successfully!');
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error('Failed to update lab profile:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile.');
    }
  };

  const handleCancel = () => {
    // Revert changes by resetting edit states to current labProfile values
    if (labProfile) {
      setName(labProfile.name || '');
      setEmail(labProfile.email || '');
      setPhone(labProfile.phone || '');
      setAddress(labProfile.address || '');
      setWebsite(labProfile.website || '');
      setTestsOffered(labProfile.testsOffered || []); // NEW: Revert testsOffered
    }
    setIsEditing(false); // Exit edit mode
  };

  const handleNewTestChange = (e) => {
    setNewTest({ ...newTest, [e.target.name]: e.target.value });
  };

  const handleAddTest = () => {
    if (newTest.testName && newTest.testType && newTest.price >= 0) { // Changed condition
      setTestsOffered([...testsOffered, newTest]); // Use newTest directly
      setNewTest({ testName: '', testType: '', price: 0 }); // Clear form
    } else {
      toast.error('Test Name, Test Type, and Price are required, and price must be non-negative.'); // Updated error message
    }
  };

  const handleDeleteTest = (index) => {
    setTestsOffered(testsOffered.filter((_, i) => i !== index));
  };

  const handleTestChange = (index, field, value) => {
    const updatedTests = [...testsOffered];
    updatedTests[index][field] = value;
    setTestsOffered(updatedTests);
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background text-foreground"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center">
        <span className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
          Lab Profile
        </span>
        <span className="ml-2">🔬</span> {/* Emoji alag se */}
      </h1>

      {loading ? (
        <p>Loading lab profile...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : labProfile ? (
        <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-md p-6 border border-border max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary-foreground text-5xl font-bold mb-4">
              {labProfile.name ? labProfile.name[0].toUpperCase() : 'L'}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold text-foreground bg-transparent border-b border-border focus:outline-none focus:border-hs-gradient-middle text-center"
              />
            ) : (
              <h2 className="text-2xl font-bold text-foreground">{labProfile.name}</h2>
            )}
            <p className="text-muted-foreground text-sm">Lab ID: {labProfile.labId}</p>
            <p className="text-muted-foreground text-sm">Established: {new Date(labProfile.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="space-y-4">
            {/* Director info might be part of the User model or a separate field in Lab model if needed */}
            {/* <motion.div variants={itemVariants} className="flex items-center space-x-3">
              <User className="h-5 w-5 text-hs-gradient-middle flex-shrink-0" />
              <p className="text-foreground"><span className="font-semibold">Director:</span> {labProfile.director}</p>
            </motion.div> */}
            <motion.div variants={itemVariants} className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-hs-gradient-middle flex-shrink-0" />
              <p className="text-foreground"><span className="font-semibold">Email:</span> 
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-b border-border focus:outline-none focus:border-hs-gradient-middle"
                  />
                ) : (
                  labProfile.email
                )}
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-hs-gradient-middle flex-shrink-0" />
              <p className="text-foreground"><span className="font-semibold">Phone:</span> 
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent border-b border-border focus:outline-none focus:border-hs-gradient-middle"
                  />
                ) : (
                  labProfile.phone || 'N/A'
                )}
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-hs-gradient-middle flex-shrink-0 mt-1" />
              <p className="text-foreground"><span className="font-semibold">Address:</span> 
                {isEditing ? (
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-transparent border-b border-border focus:outline-none focus:border-hs-gradient-middle"
                  />
                ) : (
                  labProfile.address || 'N/A'
                )}
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="pt-4 border-t border-border mt-4">
              <h3 className="text-lg font-semibold mb-2">Website</h3>
              <p className="text-muted-foreground leading-relaxed">
                {isEditing ? (
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="bg-transparent border-b border-border focus:outline-none focus:border-hs-gradient-middle w-full"
                  />
                ) : (
                  labProfile.website ? <a href={labProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{labProfile.website}</a> : 'N/A'
                )}
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="pt-4 border-t border-border mt-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><FlaskConical className="h-5 w-5"/> Tests Offered</h3>
              {isEditing ? (
                <div className="space-y-3">
                  {testsOffered.map((test, index) => (
                    <div key={index} className="bg-muted/30 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={test.testName}
                          onChange={(e) => handleTestChange(index, 'testName', e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm"
                        />
                        <input
                          type="text"
                          value={test.testType}
                          onChange={(e) => handleTestChange(index, 'testType', e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background text-foreground text-xs mt-1"
                        />
                        <input
                          type="number"
                          value={test.price}
                          onChange={(e) => handleTestChange(index, 'price', parseFloat(e.target.value))}
                          className="w-full p-2 border border-border rounded-md bg-background text-foreground text-xs mt-1"
                        />
                      </div>
                      <button onClick={() => handleDeleteTest(index)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 p-3 border border-dashed border-border rounded-md">
                    <input
                      type="text"
                      name="testName"
                      placeholder="Test Name"
                      value={newTest.testName}
                      onChange={handleNewTestChange}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm"
                    />
                    <input
                      type="text"
                      name="testType"
                      placeholder="Test Type"
                      value={newTest.testType}
                      onChange={handleNewTestChange}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm"
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={newTest.price}
                      onChange={handleNewTestChange}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm"
                    />
                    <button onClick={handleAddTest} className="flex items-center justify-center gap-2 px-4 py-2 bg-hs-gradient-middle text-white rounded-md hover:opacity-90 transition-opacity mt-2"><PlusCircle size={18}/> Add Test</button>
                  </div>
                </div>
              ) : (
                testsOffered.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {testsOffered.map((test, index) => (
                      <li key={index}>{test.testName} ({test.testType}) - ₹{test.price}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No tests offered yet.</p>
                )
              )}
            </motion.div>
            {/* Description field is not in Lab model, so commenting out for now */}
            {/* <motion.div variants={itemVariants} className="pt-4 border-t border-border mt-4">
              <h3 className="text-lg font-semibold mb-2">About Us</h3>
              <p className="text-muted-foreground leading-relaxed">
                {labInfo.description}
              </p>
            </motion.div> */}
          </div>

          <div className="mt-8 text-center">
            {isEditing ? (
              <div className="flex justify-center space-x-4">
                <motion.button 
                  variants={itemVariants} 
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-500 text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </motion.button>
                <motion.button 
                  variants={itemVariants} 
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button 
                variants={itemVariants} 
                onClick={() => setIsEditing(true)} // Set edit mode
                className="px-6 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                Edit Profile
              </motion.button>
            )}
          </div>
        </motion.div>
      ) : (
        <p className="text-muted-foreground text-center">No lab profile data available.</p>
      )}
    </motion.div>
  );
};

export default LabProfilePage;
