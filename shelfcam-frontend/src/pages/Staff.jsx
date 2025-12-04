import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  UserCheck,
  UserX,
  Mail,
  Phone
} from 'lucide-react';

const Staff = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'staff',
    department: '',
    assigned_shelf: '',
    is_active: true
  });

  useEffect(() => {
    fetchStaff();
    fetchShelves();
  }, [filter]);

  const fetchShelves = async () => {
    try {
      const response = await api.get('/shelves/');
      const shelvesData = response.data.shelves || response.data || [];
      setShelves(shelvesData.filter(shelf => shelf.is_active));
    } catch (error) {
      console.error('Error fetching shelves:', error);
      setShelves([]);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      console.log('Fetching staff from backend...');
      
      // Try different possible endpoints
      let response;
      try {
        response = await api.get('/staff/');
      } catch (e) {
        console.log('Trying alternative endpoint...');
        // Try getting employees directly
        response = await api.get('/employees/');
      }
      
      console.log('Staff API response:', response.data);
      const staffData = response.data.staff || response.data.employees || response.data || [];
      console.log('Processed staff data:', staffData);
      
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      console.error('Error details:', error.response?.data);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.role) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Check for duplicate username/email
    const isDuplicate = staff.some(member => 
      (member.username === formData.username || member.email === formData.email) &&
      (!editingStaff || member.id !== editingStaff.id)
    );
    
    if (isDuplicate) {
      alert('Username or email already exists.');
      return;
    }
    
    try {
      const submitData = {
        ...formData,
        id: editingStaff ? editingStaff.id : Date.now(),
        employee_id: editingStaff ? editingStaff.employee_id : `EMP${String(Date.now()).slice(-3)}`,
        created_at: editingStaff ? editingStaff.created_at : new Date().toISOString()
      };
      
      let updatedStaff;
      if (editingStaff) {
        updatedStaff = staff.map(member => 
          member.id === editingStaff.id ? submitData : member
        );
      } else {
        updatedStaff = [...staff, submitData];
      }
      
      setStaff(updatedStaff);
      
      setShowModal(false);
      setEditingStaff(null);
      setFormData({
        username: '',
        email: '',
        phone: '',
        role: 'staff',
        department: '',
        assigned_shelf: '',
        is_active: true
      });
    } catch (error) {
      console.error('Error saving staff member:', error);
      alert('Error saving staff member. Please try again.');
    }
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setFormData({
      username: member.username,
      email: member.email,
      phone: member.phone || '',
      role: member.role,
      department: member.department || '',
      assigned_shelf: member.assigned_shelf || '',
      is_active: member.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const updatedStaff = staff.filter(member => member.id !== memberId);
        setStaff(updatedStaff);
      } catch (error) {
        console.error('Error deleting staff member:', error);
        alert('Error deleting staff member.');
      }
    }
  };

  const toggleStatus = async (member) => {
    try {
      const updatedStaff = staff.map(m => 
        m.id === member.id ? { ...m, is_active: !m.is_active } : m
      );
      setStaff(updatedStaff);
    } catch (error) {
      console.error('Error toggling staff status:', error);
      alert('Error updating staff status.');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'area_manager': return 'bg-purple-100 text-purple-800';
      case 'store_manager': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.username.toLowerCase().includes(search.toLowerCase()) ||
                         member.email.toLowerCase().includes(search.toLowerCase()) ||
                         member.employee_id.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'active') return matchesSearch && member.is_active;
    if (filter === 'inactive') return matchesSearch && !member.is_active;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage store staff and their roles
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Staff</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center min-w-0 flex-1">
                  <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="ml-2 min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{member.username}</h3>
                    <p className="text-xs text-gray-500 truncate">ID: {member.employee_id}</p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    member.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <Mail className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{member.email}</span>
                </div>
                
                {member.phone && (
                  <div className="flex items-center text-xs">
                    <Phone className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                    <span className="text-gray-600 truncate">{member.phone}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-gray-500">Role:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                    {member.role.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                {member.department && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 truncate">Department:</span>
                    <span className="font-medium flex-shrink-0 ml-2">{member.department}</span>
                  </div>
                )}
                
                {member.assigned_shelf && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 truncate">Assigned Shelf:</span>
                    <span className="font-medium flex-shrink-0 ml-2">{member.assigned_shelf}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex gap-1">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 inline-flex justify-center items-center px-1 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-3 w-3" />
                </button>
                
                <button
                  onClick={() => toggleStatus(member)}
                  className={`flex-1 inline-flex justify-center items-center px-1 py-1 border border-transparent text-xs font-medium rounded ${
                    member.is_active
                      ? 'text-red-700 bg-red-100 hover:bg-red-200'
                      : 'text-green-700 bg-green-100 hover:bg-green-200'
                  }`}
                >
                  {member.is_active ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                </button>
                
                <button
                  onClick={() => handleDelete(member.id)}
                  className="px-1 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No staff found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search terms.' : 'Get started by adding your first staff member.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="staff">Staff</option>
                    <option value="store_manager">Store Manager</option>
                    <option value="area_manager">Area Manager</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned Shelf</label>
                  <select
                    value={formData.assigned_shelf}
                    onChange={(e) => setFormData({...formData, assigned_shelf: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No shelf assigned</option>
                    {shelves.map((shelf) => (
                      <option key={shelf.id} value={shelf.name}>
                        {shelf.name} - {shelf.category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingStaff ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingStaff(null);
                      setFormData({
                        username: '',
                        email: '',
                        phone: '',
                        role: 'staff',
                        department: '',
                        assigned_shelf: '',
                        is_active: true
                      });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;