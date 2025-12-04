import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  Users,
  AlertTriangle
} from 'lucide-react';

const Shelves = () => {
  const { user } = useAuth();
  const [shelves, setShelves] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingShelf, setEditingShelf] = useState(null);
  const [assigningShelf, setAssigningShelf] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    capacity: '',
    description: '',
    assigned_staff: '',
    is_active: true
  });

  useEffect(() => {
    fetchShelves();
    fetchStaff();
  }, [filter]);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff/');
      const staffData = response.data.staff || response.data || [];
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      // Fallback to localStorage
      const storedStaff = localStorage.getItem('staff');
      if (storedStaff) {
        setStaff(JSON.parse(storedStaff));
      } else {
        setStaff([]);
      }
    }
  };

  const fetchShelves = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shelves/');
      setShelves(response.data.shelves || []);
    } catch (error) {
      console.error('Error fetching shelves:', error);
      // Fallback to localStorage or mock data
      const storedShelves = localStorage.getItem('shelves');
      if (storedShelves) {
        setShelves(JSON.parse(storedShelves));
      } else {
        const mockShelves = [
          {
            id: 1,
            name: 'Shelf A1',
            category: 'Electronics',
            capacity: 100,
            current_stock: 75,
            description: 'Main electronics display shelf',
            is_active: true
          }
        ];
        setShelves(mockShelves);
        localStorage.setItem('shelves', JSON.stringify(mockShelves));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.capacity) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };
      
      let response;
      if (editingShelf) {
        response = await api.put(`/shelves/${editingShelf.id}`, submitData);
      } else {
        response = await api.post('/shelves/', submitData);
      }
      
      // Update local state with backend response
      const updatedShelf = response.data;
      
      if (editingShelf) {
        const updatedShelves = shelves.map(shelf => 
          shelf.id === editingShelf.id ? updatedShelf : shelf
        );
        setShelves(updatedShelves);
      } else {
        setShelves([...shelves, updatedShelf]);
      }
      
      // Handle staff assignment if provided
      if (formData.assigned_staff) {
        try {
          await api.post('/staff-assignments/', {
            staff_id: parseInt(formData.assigned_staff),
            shelf_id: updatedShelf.id
          });
        } catch (assignError) {
          console.error('Error assigning staff:', assignError);
        }
      }
      
      // Refresh shelves from backend
      fetchShelves();
      
      setShowModal(false);
      setEditingShelf(null);
      setFormData({
        name: '',
        category: '',
        capacity: '',
        description: '',
        assigned_staff: '',
        is_active: true
      });
    } catch (error) {
      console.error('Error saving shelf:', error);
      alert(error.response?.data?.detail || 'Error saving shelf. Please check all fields and try again.');
    }
  };

  const handleEdit = (shelf) => {
    setEditingShelf(shelf);
    const assignedStaff = staff.find(s => s.assigned_shelf === shelf.name);
    setFormData({
      name: shelf.name,
      category: shelf.category,
      capacity: shelf.capacity.toString(),
      description: shelf.description || '',
      assigned_staff: assignedStaff ? assignedStaff.id.toString() : '',
      is_active: shelf.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (shelfName) => {
    if (window.confirm('Are you sure you want to delete this shelf?')) {
      try {
        await api.delete(`/shelves/${shelfName}`);
        fetchShelves();
      } catch (error) {
        console.error('Error deleting shelf:', error);
        alert('Cannot delete shelf. It may have active assignments.');
      }
    }
  };

  const toggleStatus = async (shelf) => {
    try {
      await api.patch(`/shelves/${shelf.name}/toggle-status`);
      fetchShelves();
    } catch (error) {
      console.error('Error toggling shelf status:', error);
      alert('Cannot change status. Shelf may have active assignments.');
    }
  };

  const handleAssignStaff = (shelf) => {
    setAssigningShelf(shelf);
    setShowAssignModal(true);
  };

  const handleStaffAssignment = (staffId) => {
    try {
      const updatedStaff = staff.map(member => ({
        ...member,
        assigned_shelf: member.id === parseInt(staffId) ? assigningShelf.name : 
                       member.assigned_shelf === assigningShelf.name ? '' : member.assigned_shelf
      }));
      
      setStaff(updatedStaff);
      localStorage.setItem('staff', JSON.stringify(updatedStaff));
      setShowAssignModal(false);
      setAssigningShelf(null);
    } catch (error) {
      console.error('Error assigning staff:', error);
      alert('Error assigning staff to shelf.');
    }
  };

  const filteredShelves = shelves.filter(shelf => {
    const matchesSearch = shelf.name.toLowerCase().includes(search.toLowerCase()) ||
                         shelf.category.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'active') return matchesSearch && shelf.is_active;
    if (filter === 'inactive') return matchesSearch && !shelf.is_active;
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
          <h1 className="text-2xl font-bold text-gray-900">Shelves</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage store shelves and their configurations
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Shelf
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
                placeholder="Search shelves..."
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
              <option value="all">All Shelves</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shelves Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredShelves.map((shelf) => (
          <div key={shelf.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center min-w-0 flex-1">
                  <Package className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div className="ml-2 min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{shelf.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{shelf.category}</p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    shelf.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {shelf.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 truncate">Capacity:</span>
                  <span className="font-medium flex-shrink-0 ml-2">{shelf.capacity}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 truncate">Stock:</span>
                  <span className="font-medium flex-shrink-0 ml-2">{shelf.current_stock || 0}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 truncate">Assigned:</span>
                  <span className="font-medium flex-shrink-0 ml-2">
                    {staff.find(s => s.assigned_shelf === shelf.name && s.is_active)?.username || 'None'}
                  </span>
                </div>
                
                {shelf.description && (
                  <p className="text-xs text-gray-600 mt-1 break-words line-clamp-2">{shelf.description}</p>
                )}
              </div>
              
              <div className="mt-3 flex gap-1">
                <button
                  onClick={() => handleEdit(shelf)}
                  className="flex-1 inline-flex justify-center items-center px-1 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-3 w-3" />
                </button>
                
                <button
                  onClick={() => toggleStatus(shelf)}
                  className={`flex-1 inline-flex justify-center items-center px-1 py-1 border border-transparent text-xs font-medium rounded ${
                    shelf.is_active
                      ? 'text-red-700 bg-red-100 hover:bg-red-200'
                      : 'text-green-700 bg-green-100 hover:bg-green-200'
                  }`}
                >
                  {shelf.is_active ? 'Off' : 'On'}
                </button>
                
                <button
                  onClick={() => handleAssignStaff(shelf)}
                  className="px-1 py-1 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-white hover:bg-blue-50"
                  title="Assign Staff"
                >
                  <Users className="h-3 w-3" />
                </button>
                
                <button
                  onClick={() => handleDelete(shelf.name)}
                  className="px-1 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredShelves.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No shelves found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search terms.' : 'Get started by creating a new shelf.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingShelf ? 'Edit Shelf' : 'Add New Shelf'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned Staff</label>
                  <select
                    value={formData.assigned_staff}
                    onChange={(e) => setFormData({...formData, assigned_staff: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No staff assigned</option>
                    {staff.filter(s => s.is_active && s.role === 'staff').map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.username} ({member.employee_id})
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
                    {editingShelf ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingShelf(null);
                      setFormData({
                        name: '',
                        category: '',
                        capacity: '',
                        description: '',
                        assigned_staff: '',
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

      {/* Staff Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Assign Staff to {assigningShelf?.name}
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleStaffAssignment('')}
                  className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <span className="text-gray-500">No assignment</span>
                </button>
                
                {staff.filter(s => s.is_active && s.role === 'staff').map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleStaffAssignment(member.id)}
                    className={`w-full text-left px-3 py-2 border rounded-md hover:bg-blue-50 ${
                      member.assigned_shelf === assigningShelf?.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{member.username}</span>
                      <span className="text-xs text-gray-500">{member.employee_id}</span>
                    </div>
                    {member.assigned_shelf && member.assigned_shelf !== assigningShelf?.name && (
                      <span className="text-xs text-orange-600">Currently: {member.assigned_shelf}</span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssigningShelf(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shelves;