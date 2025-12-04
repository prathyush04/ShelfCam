import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    shelves: { total: 0, active: 0 },
    assignments: { total: 0, active: 0 },
    alerts: { total: 0, critical: 0 },
    staff: { total: 0, available: 0 }
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [assignedShelf, setAssignedShelf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch different data based on user role
      if (user?.role === 'staff') {
        // Staff dashboard - get assigned shelf from backend
        try {
          const [staffResponse, shelvesResponse] = await Promise.all([
            api.get('/staff/'),
            api.get('/shelves/')
          ]);
          
          const staffData = staffResponse.data.staff || staffResponse.data || [];
          const shelvesData = shelvesResponse.data.shelves || shelvesResponse.data || [];
          
          const currentStaff = staffData.find(s => s.employee_id === user.employee_id);
          if (currentStaff?.assigned_shelf) {
            const shelf = shelvesData.find(s => s.name === currentStaff.assigned_shelf);
            setAssignedShelf(shelf);
          }
        } catch (error) {
          console.error('Error fetching staff dashboard data:', error);
        }
        
        // Mock alerts for staff
        setRecentAlerts([]);
        setStats(prev => ({
          ...prev,
          alerts: { total: 0, critical: 0 }
        }));
      } else {
        // Manager dashboard - comprehensive data
        const [alertsResponse, assignmentsResponse] = await Promise.all([
          api.get('/alerts/active'),
          api.get('/staff-assignments/dashboard')
        ]);

        setRecentAlerts(alertsResponse.data.alerts?.slice(0, 5) || []);
        
        if (assignmentsResponse.data) {
          setStats({
            shelves: {
              total: assignmentsResponse.data.total_shelves || 0,
              active: assignmentsResponse.data.active_shelves || 0
            },
            assignments: {
              total: assignmentsResponse.data.total_assignments || 0,
              active: assignmentsResponse.data.active_assignments || 0
            },
            alerts: {
              total: alertsResponse.data.count || 0,
              critical: alertsResponse.data.alerts?.filter(a => a.priority === 'critical').length || 0
            },
            staff: {
              total: assignmentsResponse.data.active_assignments || 0,
              available: assignmentsResponse.data.available_staff_count || 0
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 text-${color}-600`} />
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <dl>
              <dt className="text-xs font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-base font-medium text-gray-900 truncate">{value}</dd>
              {subtitle && (
                <dd className="text-xs text-gray-500 truncate">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const AlertCard = ({ alert }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'critical': return 'text-red-600 bg-red-100';
        case 'high': return 'text-orange-600 bg-orange-100';
        case 'medium': return 'text-yellow-600 bg-yellow-100';
        default: return 'text-green-600 bg-green-100';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'acknowledged': return <Clock className="h-4 w-4 text-yellow-500" />;
        default: return <XCircle className="h-4 w-4 text-red-500" />;
      }
    };

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {getStatusIcon(alert.status)}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                {alert.priority?.toUpperCase()}
              </span>
            </div>
            <h4 className="mt-2 text-sm font-medium text-gray-900">{alert.title}</h4>
            <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span>Shelf: {alert.shelf_name}</span>
              {alert.created_at && (
                <span className="ml-4">
                  {new Date(alert.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.username}! Here's what's happening in your store.
        </p>
      </div>

      {/* Stats Grid */}
      {user?.role !== 'staff' && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Shelves"
            value={stats.shelves.total}
            subtitle={`${stats.shelves.active} active`}
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Staff Assignments"
            value={stats.assignments.active}
            subtitle={`${stats.assignments.total} total`}
            icon={Users}
            color="green"
          />
          <StatCard
            title="Active Alerts"
            value={stats.alerts.total}
            subtitle={`${stats.alerts.critical} critical`}
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="Available Staff"
            value={stats.staff.available}
            subtitle="Ready for assignment"
            icon={Activity}
            color="purple"
          />
        </div>
      )}

      {/* Staff Assigned Shelf */}
      {user?.role === 'staff' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Your Assigned Shelf
            </h3>
            
            {assignedShelf ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Package className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="ml-3 flex-1">
                    <h4 className="text-base font-medium text-blue-900">{assignedShelf.name}</h4>
                    <p className="text-sm text-blue-700 mt-1">Category: {assignedShelf.category}</p>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Capacity:</span>
                        <span className="ml-2 text-blue-900">{assignedShelf.capacity} items</span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Current Stock:</span>
                        <span className="ml-2 text-blue-900">{assignedShelf.current_stock || 0} items</span>
                      </div>
                    </div>
                    
                    {assignedShelf.description && (
                      <p className="text-sm text-blue-700 mt-2">{assignedShelf.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">No shelf assigned</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Contact your manager to get a shelf assignment.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {user?.role === 'staff' ? 'Your Alerts' : 'Recent Alerts'}
          </h3>
          
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === 'staff' 
                  ? "You don't have any alerts assigned to you." 
                  : "No recent alerts to display."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role !== 'staff' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button 
                onClick={() => navigate('/shelves')}
                className="bg-white relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Package className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Add New Shelf
                </span>
              </button>
              <button 
                onClick={() => alert('Staff assignment feature coming soon!')}
                className="bg-white relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Users className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Assign Staff
                </span>
              </button>
              <button 
                onClick={() => alert('Reports feature coming soon!')}
                className="bg-white relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <TrendingUp className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  View Reports
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;