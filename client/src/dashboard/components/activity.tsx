import React, { useEffect, useState } from 'react';
import { Clock, Filter, Download, Search, ChevronDown, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface DeviceInfo {
  ipAddress: string;
  userAgent: string;
}

interface ActivityItemProps {
  actionType: string;
  description: string;
  timestamp: string;
  deviceInfo?: DeviceInfo;
}

interface ActivityData {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  deviceInfo?: DeviceInfo;
}

interface PaginationState {
  page: number;
  limit: number;
  totalPages: number;
}

interface ActionTypeStyle {
  bgColor: string;
  textColor: string;
  icon: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  actionType,
  description,
  timestamp,
  deviceInfo,
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  // Map action types to icon backgrounds and appropriate icons
  const getActionTypeStyles = (): ActionTypeStyle => {
    switch (actionType.toLowerCase()) {
      case 'login':
        return { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: '🔐' };
      case 'logout':
        return { bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: '👋' };
      case 'profile update name':
        return { bgColor: 'bg-purple-100', textColor: 'text-purple-800', icon: '✏️' };
      case 'profile update password':
        return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: '🔒' };
      case 'profile picture upload':
        return { bgColor: 'bg-pink-100', textColor: 'text-pink-800', icon: '📷' };
      case 'profile picture delete':
        return { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: '🗑️' };
      default:
        return { bgColor: 'bg-gray-100', textColor: 'text-gray-800', icon: '📝' };
    }
  };

  const { bgColor, icon } = getActionTypeStyles();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Parse user agent to get device info
  const getBrowserInfo = (userAgent: string | undefined): string => {
    if (!userAgent) return 'Unknown device';
    
    // Try to determine browser
    let browser = 'Unknown browser';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) browser = 'Internet Explorer';
    
    return `${browser}`;
  };

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex items-start">
        <div className={`${bgColor} rounded-full p-2 mr-4 flex-shrink-0`}>
          <span className="text-xl">{icon}</span>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                      
          <p className=" font-medium text-gray-800">{description}</p>
            <span className="text-xs text-gray-500">{formatDate(timestamp)}</span>
          </div>
          {/* <h4 className="text-sm text-gray-600 mb-2">{actionType}</h4> */}
          {deviceInfo && (
            <div>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-gray-500 flex items-center hover:text-gray-700"
              >
                {showDetails ? 'Hide details' : 'Show details'}
                <ChevronDown className={`ml-1 h-3 w-3 transform ${showDetails ? 'rotate-180' : ''}`} />
              </button>
              
              {showDetails && (
                <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs text-gray-600">
                  <p>IP Address: {deviceInfo.ipAddress || 'Unknown'}</p>
                  <p>Device: {getBrowserInfo(deviceInfo.userAgent)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActivityLog: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<string>('last30');
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    totalPages: 1
  });

  // Calculate date range based on selection
  const getDateRange = (): string | null => {
    const now = new Date();
    let startDate = null;
    
    switch (dateRange) {
      case 'last7':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'last30':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'last90':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = null;
    }
    
    return startDate ? startDate.toISOString() : null;
  };

  const fetchActivities = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      
      if (filter !== 'all') {
        params.append('type', filter);
      }
      
      const startDate = getDateRange();
      if (startDate) {
        params.append('startDate', startDate);
      }
      
      const response = await axios.get(`http://localhost:5000/api/activities?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Check if the response has the expected structure
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch activities');
      }
      
      // Safely handle the response data
      const activitiesData = response.data.data || [];
      setActivities(activitiesData);
      
      // Safely handle pagination
      if (response.data.pagination) {
        setPagination(prev => ({
          ...prev,
          page: response.data.pagination.page || prev.page,
          totalPages: response.data.pagination.totalPages || 1
        }));
      } else {
        // Calculate pagination based on data if not provided
        const totalItems = response.data.total || activitiesData.length;
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(totalItems / prev.limit) || 1
        }));
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Failed to load activity history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dateRange, pagination.page]);

  const clearActivityHistory = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to clear your entire activity history? This action cannot be undone.')) {
      try {
        await axios.delete('http://localhost:5000/api/activities/clear', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setActivities([]);
        setPagination({
          ...pagination,
          page: 1,
          totalPages: 0
        });
      } catch (error) {
        console.error('Error clearing activity history:', error);
        setError('Failed to clear activity history. Please try again.');
      }
    }
  };

  // Update the filteredActivities definition to handle potential undefined values
  const filteredActivities = activities ? activities.filter(activity => {
    if (searchQuery && 
        !activity.action.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !activity.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }) : [];

  const changePage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({
        ...pagination,
        page: newPage
      });
    }
  };

  // Add downloadActivityLog inside the component
  const downloadActivityLog = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Get all activities for download (no pagination)
      const response = await axios.get('http://localhost:5000/api/activities?limit=1000', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Safely access the data
      const activitiesData = response.data.data || [];
      
      // Convert activities to CSV format
      const csvData = [
        ['Action', 'Description', 'Timestamp', 'IP Address', 'Device Info'],
        ...activitiesData.map((activity: ActivityData) => [
          activity.action,
          activity.description,
          new Date(activity.timestamp).toLocaleString(),
          activity.deviceInfo?.ipAddress || '',
          activity.deviceInfo?.userAgent || ''
        ])
      ]
        .map(row => row.map((cell: unknown) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      
      // Create blob and download
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'activity_log.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading activity log:', error);
      setError('Failed to download activity log. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-4 space-y-6 my-6">
        {/* Header */}
        <h1 className="text-xl font-semibold mb-4">Activity Log</h1>

        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-blue-400">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <Clock className="text-xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Your Account Activity
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Track your account activities including logins, profile updates, and security changes.
                This helps you ensure your account remains secure.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter dropdown */}
            <div className="flex-shrink-0">
              <div className="relative inline-block w-full sm:w-auto">
                <div className="flex items-center">
                  <Filter size={18} className="mr-2 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 cursor-pointer"
                  >
                    <option value="all">All Activities</option>
                    <option value="login">Logins</option>
                    <option value="logout">Logouts</option>
                    <option value="profile_update_name">Name Updates</option>
                    <option value="profile_update_password">Password Changes</option>
                    <option value="profile_picture_upload">Profile Picture Uploads</option>
                    <option value="profile_picture_delete">Profile Picture Removals</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Date range */}
            <div className="flex-shrink-0">
              <div className="relative inline-block w-full sm:w-auto">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 cursor-pointer"
                >
                  <option value="last7">Last 7 days</option>
                  <option value="last30">Last 30 days</option>
                  <option value="last90">Last 90 days</option>
                  <option value="year">This year</option>
                  <option value="all">All time</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
              </div>
            </div>
            
            {/* Download button */}
            <button 
              onClick={downloadActivityLog}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              disabled={isLoading}
            >
              <Download size={18} className="mr-2" />
              Export
            </button>
          </div>

          {/* Activity List */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">Activity History</h3>
              <button
                onClick={clearActivityHistory}
                className="text-sm text-red-500 hover:text-red-700 flex items-center"
              >
                <X size={14} className="mr-1" />
                Clear history
              </button>
            </div>
            
            {error && (
              <div className="p-4 mb-4 bg-red-50 border border-red-100 rounded-lg flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={18} />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-300 border-l-blue-300 border-r-blue-300 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading activity data...</p>
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="space-y-1">
                {filteredActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    actionType={activity.action}
                    description={activity.description}
                    timestamp={activity.timestamp}
                    deviceInfo={activity.deviceInfo}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border rounded-lg bg-gray-50">
                <p className="text-gray-500">No activities found matching your filters.</p>
                <button 
                  onClick={() => {setFilter('all'); setSearchQuery(''); setDateRange('last30');}}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredActivities.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded ${
                    pagination.page === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.totalPages || 
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  )
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-3 py-1 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => changePage(page)}
                          className={`px-3 py-1 rounded ${
                            pagination.page === page
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
                
                <button
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 rounded ${
                    pagination.page === pagination.totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;