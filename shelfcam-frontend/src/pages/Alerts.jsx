import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

const Alerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      let url = '/alerts/active';
      
      if (user?.role === 'staff') {
        url = `/alerts/dashboard/${user.employee_id}`;
      } else if (filter !== 'all') {
        url = `/alerts?status=${filter}`;
      }
      
      const response = await api.get(url);
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const handleAcknowledge = async (alertId) => {
    try {
      await api.post(`/alerts/acknowledge/${alertId}?employee_id=${user.employee_id}`);
      fetchAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      await api.post(`/alerts/resolve/${alertId}?employee_id=${user.employee_id}`);
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'acknowledged': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const filteredAlerts = alerts.filter(alert =>
    alert.title?.toLowerCase().includes(search.toLowerCase()) ||
    alert.shelf_name?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === 'staff' ? 'Your assigned alerts' : 'Manage system alerts'}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
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
                placeholder="Search alerts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {user?.role !== 'staff' && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Alerts</option>
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white shadow rounded-lg">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Try adjusting your search terms.' : 'No alerts match your current filters.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(alert.status)}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority?.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {alert.alert_type?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      {alert.title}
                    </h3>
                    
                    <p className="mt-1 text-sm text-gray-600">
                      {alert.message}
                    </p>
                    
                    <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                      <span>Shelf: {alert.shelf_name}</span>
                      {alert.created_at && (
                        <span>
                          Created: {new Date(alert.created_at).toLocaleString()}
                        </span>
                      )}
                      {alert.assigned_staff_id && (
                        <span>Assigned to: {alert.assigned_staff_id}</span>
                      )}
                    </div>
                  </div>
                  
                  {alert.status === 'active' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Acknowledge
                      </button>
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;