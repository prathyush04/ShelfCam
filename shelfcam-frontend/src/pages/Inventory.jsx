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
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

const Inventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    min_threshold: '',
    max_threshold: '',
    unit_price: '',
    shelf_name: '',
    description: ''
  });

  useEffect(() => {
    fetchInventory();
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

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory/');
      const inventoryData = response.data.inventory || response.data || [];
      setInventory(inventoryData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.quantity) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const quantity = parseInt(formData.quantity);
    const selectedShelf = shelves.find(shelf => shelf.name === formData.shelf_name);
    
    // Check shelf capacity if shelf is selected
    if (selectedShelf) {
      const currentShelfStock = inventory
        .filter(item => item.shelf_name === selectedShelf.name && (!editingItem || item.id !== editingItem.id))
        .reduce((total, item) => total + item.quantity, 0);
      
      if (currentShelfStock + quantity > selectedShelf.capacity) {
        alert(`Cannot add ${quantity} items. Shelf capacity is ${selectedShelf.capacity}, current stock is ${currentShelfStock}. Available space: ${selectedShelf.capacity - currentShelfStock}`);
        return;
      }
    }
    
    try {
      const submitData = {
        ...formData,
        quantity: quantity,
        min_threshold: parseInt(formData.min_threshold) || 0,
        max_threshold: parseInt(formData.max_threshold) || 100,
        unit_price: parseFloat(formData.unit_price) || 0,
        id: editingItem ? editingItem.id : Date.now(),
        last_updated: new Date().toISOString()
      };
      
      let updatedInventory;
      if (editingItem) {
        updatedInventory = inventory.map(item => 
          item.id === editingItem.id ? submitData : item
        );
      } else {
        updatedInventory = [...inventory, submitData];
      }
      
      // Save to backend
      if (editingItem) {
        await api.put(`/inventory/${editingItem.id}`, submitData);
      } else {
        await api.post('/inventory/', submitData);
      }
      
      // Refresh data from backend
      fetchInventory();
      fetchShelves();
      
      setShowModal(false);
      setEditingItem(null);
      setFormData({
        name: '',
        sku: '',
        category: '',
        quantity: '',
        min_threshold: '',
        max_threshold: '',
        unit_price: '',
        shelf_name: '',
        description: ''
      });
    } catch (error) {
      console.error('Error saving inventory item:', error);
      alert('Error saving item. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity.toString(),
      min_threshold: item.min_threshold.toString(),
      max_threshold: item.max_threshold.toString(),
      unit_price: item.unit_price.toString(),
      shelf_name: item.shelf_name,
      description: item.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/inventory/${itemId}`);
        fetchInventory();
        fetchShelves();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item.');
      }
    }
  };

  const getStockStatus = (item) => {
    if (item.quantity <= item.min_threshold) return 'low';
    if (item.quantity >= item.max_threshold) return 'high';
    return 'normal';
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.sku.toLowerCase().includes(search.toLowerCase()) ||
                         item.category.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'low') return matchesSearch && getStockStatus(item) === 'low';
    if (filter === 'high') return matchesSearch && getStockStatus(item) === 'high';
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your store inventory
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
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
                placeholder="Search items..."
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
              <option value="all">All Items</option>
              <option value="low">Low Stock</option>
              <option value="high">Overstock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredInventory.map((item) => {
          const status = getStockStatus(item);
          return (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center min-w-0 flex-1">
                    <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="ml-2 min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 truncate">SKU: {item.sku}</p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      status === 'low' 
                        ? 'bg-red-100 text-red-800' 
                        : status === 'high'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {status === 'low' ? 'Low Stock' : status === 'high' ? 'Overstock' : 'Normal'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 truncate">Category:</span>
                    <span className="font-medium flex-shrink-0 ml-2">{item.category}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 truncate">Quantity:</span>
                    <span className="font-medium flex-shrink-0 ml-2">{item.quantity}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 truncate">Price:</span>
                    <span className="font-medium flex-shrink-0 ml-2">${item.unit_price}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 truncate">Shelf:</span>
                    <span className="font-medium flex-shrink-0 ml-2">{item.shelf_name}</span>
                  </div>
                  
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-1 break-words">{item.description}</p>
                  )}
                </div>
                
                <div className="mt-3 flex gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 inline-flex justify-center items-center px-1 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-1 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search terms.' : 'Get started by adding your first inventory item.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
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
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Threshold</label>
                    <input
                      type="number"
                      value={formData.min_threshold}
                      onChange={(e) => setFormData({...formData, min_threshold: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Threshold</label>
                    <input
                      type="number"
                      value={formData.max_threshold}
                      onChange={(e) => setFormData({...formData, max_threshold: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shelf</label>
                  <select
                    value={formData.shelf_name}
                    onChange={(e) => setFormData({...formData, shelf_name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a shelf</option>
                    {shelves.map((shelf) => (
                      <option key={shelf.id} value={shelf.name}>
                        {shelf.name} - {shelf.category}
                      </option>
                    ))}
                  </select>
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
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                      setFormData({
                        name: '',
                        sku: '',
                        category: '',
                        quantity: '',
                        min_threshold: '',
                        max_threshold: '',
                        unit_price: '',
                        shelf_name: '',
                        description: ''
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

export default Inventory;