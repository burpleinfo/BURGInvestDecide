import React, { useState } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // State management
  const [activeSection, setActiveSection] = useState('overview');
  const [clients, setClients] = useState([
    { id: 1, name: 'Rajesh Sharma', email: 'rajesh.s@example.com', phone: '+91 98765 43210', city: 'Gurugram', investment: '₹2.4Cr', property: 'Residential', stage: 'Negotiation', probability: 85, meeting: { date: '2026-03-20', time: '16:00', mode: 'Video call' }, source: 'Landing Page', enquiryDate: '15 Mar 2026', lastContact: '20 Mar 2026', notes: 'Interested in Golf Course road properties. Budget flexible.', messages: [
      { from: 'client', text: 'Hi, I\'m interested in the luxury properties in Gurugram. When can we discuss?', time: '10:30 AM' },
      { from: 'client', text: 'Also, do you have any options near the golf course?', time: '10:32 AM' }
    ]},
    { id: 2, name: 'Priya Singh', email: 'priya.s@example.com', phone: '+91 98765 22222', city: 'Mumbai', investment: '₹3.8Cr', property: 'Commercial', stage: 'Proposal', probability: 72, meeting: { date: '2026-03-21', time: '11:00', mode: 'In-office' }, source: 'Landing Page', enquiryDate: '16 Mar 2026', lastContact: '19 Mar 2026', notes: 'Looking for office space in Bandra. Need 2000 sq ft.', messages: [
      { from: 'client', text: 'I need a commercial space in Bandra. Do you have any options?', time: 'Yesterday' }
    ]},
    { id: 3, name: 'Amit Verma', email: 'amit.v@example.com', phone: '+91 98765 11111', city: 'Delhi', investment: '₹85L', property: 'Residential', stage: 'Qualified', probability: 45, meeting: { date: '2026-03-25', time: '15:00', mode: 'Phone call' }, source: 'Referral', enquiryDate: '14 Mar 2026', lastContact: '18 Mar 2026', notes: 'First-time buyer. Prefers Noida extension.', messages: [
      { from: 'client', text: 'Looking for a 3BHK in Noida. Budget around 80L.', time: '2 days ago' }
    ]},
    { id: 4, name: 'Neha Kapoor', email: 'neha.k@example.com', phone: '+91 98765 55555', city: 'Bangalore', investment: '₹1.2Cr', property: 'Luxury', stage: 'New', probability: 20, meeting: { date: '2026-03-23', time: '10:00', mode: 'Video call' }, source: 'Landing Page', enquiryDate: '17 Mar 2026', lastContact: '19 Mar 2026', notes: 'Interested in villas near Whitefield. Has visited site once.', messages: [
      { from: 'client', text: 'Interested in a villa near Whitefield.', time: '1 day ago' }
    ]},
    { id: 5, name: 'Rohan Gupta', email: 'rohan.g@example.com', phone: '+91 98765 12345', city: 'Lucknow', investment: '₹1.5Cr', property: 'Residential', stage: 'Enquiry', probability: 10, meeting: { date: '2026-03-24', time: '14:00', mode: 'Video call' }, source: 'Landing Page', enquiryDate: '19 Mar 2026', lastContact: '19 Mar 2026', notes: 'Looking for 4BHK in Gomti Nagar.', messages: [] },
    { id: 6, name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 98765 67890', city: 'Hyderabad', investment: '₹2.2Cr', property: 'Commercial', stage: 'Enquiry', probability: 15, meeting: { date: '2026-03-24', time: '11:30', mode: 'Phone call' }, source: 'Landing Page', enquiryDate: '19 Mar 2026', lastContact: '19 Mar 2026', notes: 'Needs office space in Hitec City.', messages: [] },
    { id: 7, name: 'Vikram Mehta', email: 'vikram.m@example.com', phone: '+91 98765 11223', city: 'Ahmedabad', investment: '₹95L', property: 'Residential', stage: 'Enquiry', probability: 8, meeting: { date: '2026-03-25', time: '16:00', mode: 'Video call' }, source: 'Referral', enquiryDate: '18 Mar 2026', lastContact: '18 Mar 2026', notes: 'First-time buyer, prefers new launch.', messages: [] },
    { id: 8, name: 'Pooja Desai', email: 'pooja.d@example.com', phone: '+91 98765 44556', city: 'Pune', investment: '₹3Cr', property: 'Luxury', stage: 'Enquiry', probability: 12, meeting: { date: '2026-03-26', time: '12:00', mode: 'In-office' }, source: 'Landing Page', enquiryDate: '18 Mar 2026', lastContact: '18 Mar 2026', notes: 'Interested in villas near Kalyani Nagar.', messages: [] },
    { id: 9, name: 'Karan Malhotra', email: 'karan.m@example.com', phone: '+91 98765 77889', city: 'Chandigarh', investment: '₹1.8Cr', property: 'Residential', stage: 'Enquiry', probability: 5, meeting: { date: '2026-03-27', time: '10:00', mode: 'Phone call' }, source: 'Landing Page', enquiryDate: '17 Mar 2026', lastContact: '17 Mar 2026', notes: 'Looking for 3BHK in Mohali.', messages: [] },
    { id: 10, name: 'Anjali Nair', email: 'anjali.n@example.com', phone: '+91 98765 99001', city: 'Kochi', investment: '₹2.5Cr', property: 'Commercial', stage: 'Enquiry', probability: 7, meeting: { date: '2026-03-28', time: '15:30', mode: 'Video call' }, source: 'Referral', enquiryDate: '17 Mar 2026', lastContact: '17 Mar 2026', notes: 'Interested in retail space.', messages: [] },
    { id: 11, name: 'Siddharth Jain', email: 'sid.j@example.com', phone: '+91 98765 23456', city: 'Indore', investment: '₹1.2Cr', property: 'Residential', stage: 'Enquiry', probability: 9, meeting: { date: '2026-03-29', time: '09:30', mode: 'Video call' }, source: 'Landing Page', enquiryDate: '16 Mar 2026', lastContact: '16 Mar 2026', notes: 'Looking for 2BHK in Vijay Nagar.', messages: [] },
    { id: 12, name: 'Ritu Sharma', email: 'ritu.s@example.com', phone: '+91 98765 34567', city: 'Jaipur', investment: '₹2Cr', property: 'Luxury', stage: 'Enquiry', probability: 6, meeting: { date: '2026-03-30', time: '17:00', mode: 'Phone call' }, source: 'Landing Page', enquiryDate: '16 Mar 2026', lastContact: '16 Mar 2026', notes: 'Interested in villas near Amer.', messages: [] }
  ]);

  // Modal states
  const [clientDetailModal, setClientDetailModal] = useState(false);
  const [meetingActionModal, setMeetingActionModal] = useState(false);
  const [composeMessageModal, setComposeMessageModal] = useState(false);
  
  // Form states
  const [currentClientId, setCurrentClientId] = useState(null);
  const [currentMeetingClientId, setCurrentMeetingClientId] = useState(null);
  const [newMeetingDate, setNewMeetingDate] = useState('2026-03-21');
  const [newMeetingTime, setNewMeetingTime] = useState('16:00');
  const [messageChannel, setMessageChannel] = useState('whatsapp');
  const [messageText, setMessageText] = useState('');
  const [composeClientId, setComposeClientId] = useState(null);
  const [showRescheduleOptions, setShowRescheduleOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = '2026-03-20';

  // Get badge color based on stage
  const getStageBadgeColor = (stage) => {
    switch(stage) {
      case 'Negotiation': return 'badge-yellow';
      case 'Proposal': return 'badge-blue';
      case 'Qualified': return 'badge-green';
      case 'Enquiry': return 'badge-purple';
      case 'New': return 'badge-purple';
      default: return 'badge-blue';
    }
  };

  // Open client detail modal
  const handleOpenClientDetail = (clientId) => {
    setCurrentClientId(clientId);
    setClientDetailModal(true);
  };

  // Close client detail modal
  const handleCloseClientDetail = () => {
    setClientDetailModal(false);
    setCurrentClientId(null);
  };

  // Open meeting action modal
  const handleOpenMeetingAction = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client && client.meeting) {
      setCurrentMeetingClientId(clientId);
      setNewMeetingDate(client.meeting.date);
      setNewMeetingTime(client.meeting.time);
      setShowRescheduleOptions(false);
      setMeetingActionModal(true);
    }
  };

  // Close meeting action modal
  const handleCloseMeetingAction = () => {
    setMeetingActionModal(false);
    setCurrentMeetingClientId(null);
    setShowRescheduleOptions(false);
  };

  // Open message compose modal
  const handleOpenMessageCompose = (clientId) => {
    setComposeClientId(clientId);
    setMessageText('');
    setComposeMessageModal(true);
  };

  // Close message compose modal
  const handleCloseMessageCompose = () => {
    setComposeMessageModal(false);
    setComposeClientId(null);
    setMessageText('');
  };

  // Accept enquiry
  const handleAcceptEnquiry = () => {
    const updatedClients = clients.map(c => 
      c.id === currentClientId ? { ...c, stage: 'Meeting Accepted' } : c
    );
    setClients(updatedClients);
    handleCloseClientDetail();
    setActiveSection('meetings');
  };

  // Reject enquiry
  const handleRejectEnquiry = () => {
    if (confirm('Reject this enquiry?')) {
      alert('Enquiry rejected.');
      handleCloseClientDetail();
    }
  };

  // Reschedule from client detail
  const handleRescheduleFromClient = () => {
    const client = clients.find(c => c.id === currentClientId);
    if (client && client.meeting) {
      handleOpenMeetingAction(currentClientId);
      handleCloseClientDetail();
      setTimeout(() => setShowRescheduleOptions(true), 100);
    }
  };

  // Confirm reschedule
  const handleConfirmReschedule = () => {
    if (!newMeetingDate || !newMeetingTime) return;
    const updatedClients = clients.map(c => 
      c.id === currentMeetingClientId 
        ? { ...c, meeting: { ...c.meeting, date: newMeetingDate, time: newMeetingTime } }
        : c
    );
    setClients(updatedClients);
    handleCloseMeetingAction();
    setActiveSection('meetings');
  };

  // Cancel meeting
  const handleCancelMeeting = () => {
    if (confirm('Cancel this meeting?')) {
      const updatedClients = clients.map(c => 
        c.id === currentMeetingClientId 
          ? { ...c, meeting: null }
          : c
      );
      setClients(updatedClients);
      handleCloseMeetingAction();
      setActiveSection('meetings');
    }
  };

  // Send message
  const handleSendMessage = () => {
    const client = clients.find(c => c.id === composeClientId);
    if (client && messageText) {
      alert(`Message sent via ${messageChannel} to ${client.name}: "${messageText}"`);
      const updatedClients = clients.map(c => 
        c.id === composeClientId
          ? { ...c, messages: [...(c.messages || []), { from: 'me', text: messageText, time: 'Just now' }] }
          : c
      );
      setClients(updatedClients);
      handleCloseMessageCompose();
    }
  };

  // Get current client
  const currentClient = clients.find(c => c.id === currentClientId);
  const currentMeetingClient = clients.find(c => c.id === currentMeetingClientId);

  // Get today's and upcoming meetings
  const todayMeetings = clients.filter(c => c.meeting && c.meeting.date === todayStr);
  const upcomingMeetings = clients.filter(c => c.meeting && c.meeting.date > todayStr);

  // Get recent clients
  const recentClients = clients.slice(0, 5);

  return (
    <div className="flex h-screen bg-gray-50 font-inter">
      {/* Sidebar */}
      <aside className="sidebar w-72 text-white flex flex-col">
        <div className="px-6 py-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold">BURG<span className="text-yellow-400">Hub</span></span>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { key: 'overview', icon: 'fas fa-chart-pie', label: 'Executive Overview' },
            { key: 'clients', icon: 'fas fa-users', label: 'Clients Details' },
            { key: 'meetings', icon: 'fas fa-calendar-check', label: 'Meetings' },
            { key: 'datahub', icon: 'fas fa-database', label: 'Data Hub' },
            { key: 'integrations', icon: 'fas fa-plug', label: 'Integrations' }
          ].map(item => (
            <div
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`nav-item ${activeSection === item.key ? 'active' : ''}`}
            >
              <i className={`${item.icon} w-6 ${activeSection === item.key ? 'text-yellow-400' : 'text-gray-400'}`}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="settings-icon" onClick={() => alert('Settings panel would open here.')}>
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </div>
        <div className="border-t border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-black font-bold text-sm">VG</div>
            <div>
              <div className="font-medium text-sm">Vatika Group</div>
              <div className="text-xs text-gray-400">Enterprise Partner</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="relative w-96">
            <i className="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search clients, meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <i className="fas fa-bell text-gray-600 text-xl"></i>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Executive Overview Section */}
          {activeSection === 'overview' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Executive Overview</h1>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border text-gray-700">
                  <i className="fas fa-calendar-alt text-yellow-500"></i>
                  <span>20 Mar 2026</span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="kpi-card">
                  <div className="text-gray-500 text-sm">Connected Clients</div>
                  <div className="text-3xl font-bold mt-2">247</div>
                  <div className="text-sm text-green-600 mt-2">+12 this week</div>
                </div>
                <div className="kpi-card">
                  <div className="text-gray-500 text-sm">Meetings Done (Mar)</div>
                  <div className="text-3xl font-bold mt-2">{todayMeetings.length + 5}</div>
                  <div className="text-sm text-green-600 mt-2">↑ 8% vs Feb</div>
                </div>
                <div className="kpi-card">
                  <div className="text-gray-500 text-sm">Active Opportunities</div>
                  <div className="text-3xl font-bold mt-2">43</div>
                  <div className="text-sm text-gray-500 mt-2">₹12.8Cr pipeline</div>
                </div>
                <div className="kpi-card">
                  <div className="text-gray-500 text-sm">Conversion Rate</div>
                  <div className="text-3xl font-bold mt-2">23.8%</div>
                  <div className="text-sm text-gray-500 mt-2">Avg: 18.2%</div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  <i className="fas fa-robot"></i>
                  <span className="font-semibold">AI Insight</span>
                </div>
                <p className="text-sm text-gray-700">5 new enquiries this week. Follow up with Rohan, Sneha, and Vikram.</p>
              </div>

              {/* Today's Meetings */}
              <div className="bg-white rounded-xl p-6 border mb-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">Today's Meetings</h3>
                <ul className="space-y-3">
                  {todayMeetings.length > 0 ? (
                    todayMeetings.map(c => (
                      <li
                        key={c.id}
                        onClick={() => handleOpenMeetingAction(c.id)}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded meeting-item hover:bg-gray-100"
                      >
                        <span>
                          <span className="font-medium text-gray-900">{c.name}</span>
                          <span className="text-xs block text-gray-600">{c.meeting.time} · {c.meeting.mode}</span>
                        </span>
                        <span className="badge badge-green">confirmed</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No meetings scheduled for today.</p>
                  )}
                </ul>
              </div>

              {/* Recent Clients Table */}
              <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Recent Clients</h3>
                  <button
                    onClick={() => setActiveSection('clients')}
                    className="text-yellow-600 text-sm hover:text-yellow-700 font-medium"
                  >
                    View all
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr>
                      <th className="px-6 py-3 text-left">Client</th>
                      <th className="px-6 py-3 text-left">Contact</th>
                      <th className="px-6 py-3 text-left">Source</th>
                      <th className="px-6 py-3 text-left">Value</th>
                      <th className="px-6 py-3 text-left">Stage</th>
                      <th className="px-6 py-3 text-left">Last Contact</th>
                      <th className="px-6 py-3 text-left">Next Meeting</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClients.map(c => (
                      <tr
                        key={c.id}
                        className="table-row hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleOpenClientDetail(c.id)}
                      >
                        <td className="px-6 py-3">
                          <div className="font-medium text-gray-900">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.city}</div>
                        </td>
                        <td className="px-6 py-3">{c.email}</td>
                        <td className="px-6 py-3">
                          <span className="badge badge-blue">{c.source}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-700">{c.investment}</td>
                        <td className="px-6 py-3">
                          <span className={`badge ${getStageBadgeColor(c.stage)}`}>{c.stage}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-600">{c.lastContact}</td>
                        <td className="px-6 py-3 text-gray-600">{c.meeting ? `${c.meeting.date} ${c.meeting.time}` : '-'}</td>
                        <td className="px-6 py-3">
                          <i
                            className="fas fa-comment-dots message-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenMessageCompose(c.id);
                            }}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clients Details Section */}
          {activeSection === 'clients' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Clients Details</h2>
              <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="table-header">
                    <tr>
                      <th className="px-6 py-3 text-left">Client</th>
                      <th className="px-6 py-3 text-left">Contact</th>
                      <th className="px-6 py-3 text-left">Source</th>
                      <th className="px-6 py-3 text-left">Type</th>
                      <th className="px-6 py-3 text-left">Value</th>
                      <th className="px-6 py-3 text-left">Stage</th>
                      <th className="px-6 py-3 text-left">Probability</th>
                      <th className="px-6 py-3 text-left">Enquiry Date</th>
                      <th className="px-6 py-3 text-left">Last Contact</th>
                      <th className="px-6 py-3 text-left">Next Meeting</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(c => (
                      <tr
                        key={c.id}
                        className="table-row hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleOpenClientDetail(c.id)}
                      >
                        <td className="px-6 py-3">
                          <div className="font-medium text-gray-900">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.city}</div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-sm text-gray-700">{c.email}</div>
                          <div className="text-xs text-gray-500">{c.phone}</div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="badge badge-blue">{c.source}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-700">{c.property}</td>
                        <td className="px-6 py-3 text-gray-700">{c.investment}</td>
                        <td className="px-6 py-3">
                          <span className={`badge ${getStageBadgeColor(c.stage)}`}>{c.stage}</span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">{c.probability}%</span>
                            <div className="progress-bar w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="progress-fill bg-yellow-500 h-full"
                                style={{ width: `${c.probability}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-gray-600">{c.enquiryDate}</td>
                        <td className="px-6 py-3 text-gray-600">{c.lastContact}</td>
                        <td className="px-6 py-3 text-gray-600">{c.meeting ? `${c.meeting.date} ${c.meeting.time}` : 'Not scheduled'}</td>
                        <td className="px-6 py-3">
                          <i
                            className="fas fa-comment-dots message-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenMessageCompose(c.id);
                            }}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Meetings Section */}
          {activeSection === 'meetings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Meetings</h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Today's Meetings</h3>
                  <ul className="space-y-3">
                    {todayMeetings.length > 0 ? (
                      todayMeetings.map(c => (
                        <li
                          key={c.id}
                          onClick={() => handleOpenMeetingAction(c.id)}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded meeting-item hover:bg-gray-100"
                        >
                          <span>
                            <span className="font-medium text-gray-900">{c.name}</span>
                            <span className="text-xs block text-gray-600">{c.meeting.time} · {c.meeting.mode}</span>
                          </span>
                          <span className="badge badge-green">confirmed</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No meetings scheduled for today.</p>
                    )}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Upcoming Meetings</h3>
                  <ul className="space-y-3">
                    {upcomingMeetings.length > 0 ? (
                      upcomingMeetings.map(c => (
                        <li
                          key={c.id}
                          onClick={() => handleOpenMeetingAction(c.id)}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded meeting-item hover:bg-gray-100"
                        >
                          <span>
                            <span className="font-medium text-gray-900">{c.name}</span>
                            <span className="text-xs block text-gray-600">{c.meeting.date} {c.meeting.time} · {c.meeting.mode}</span>
                          </span>
                          <span className="badge badge-green">scheduled</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No upcoming meetings scheduled.</p>
                    )}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-semibold mb-4 text-gray-900">March 2026</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-600 font-semibold">
                  <div>M</div>
                  <div>T</div>
                  <div>W</div>
                  <div>T</div>
                  <div>F</div>
                  <div>S</div>
                  <div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {[16, 17, 18, 19].map(day => (
                    <div key={day} className="p-2 text-gray-400">{day}</div>
                  ))}
                  <div className="p-2 bg-yellow-200 rounded-full font-semibold text-gray-900">20</div>
                  <div className="p-2 bg-yellow-100 rounded-full text-gray-900">21</div>
                  <div className="p-2 bg-yellow-100 rounded-full text-gray-900">22</div>
                  {[23, 24, 25, 26, 27, 28, 29, 30, 31].map(day => (
                    <div key={day} className="p-2 text-gray-700">{day}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Data Hub Section */}
          {activeSection === 'datahub' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Data Hub</h2>
              <div className="bg-white rounded-xl p-6 border mb-6 shadow-sm">
                <h3 className="font-semibold mb-4 text-gray-900">Upload Existing Client Files</h3>
                <div className="file-upload-area border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 block"></i>
                  <p className="text-gray-600">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">Supports CSV, Excel, Sheets</p>
                  <input type="file" className="hidden" multiple accept=".csv,.xlsx,.xls,.ods" />
                </div>
                <div className="mt-6">
                  <h4 className="font-medium mb-3 text-gray-900">Recently Uploaded</h4>
                  <div className="file-list-item">
                    <span className="text-gray-700">
                      <i className="fas fa-file-excel text-green-600 mr-2"></i> clients_march_2026.xlsx
                    </span>
                    <span className="text-xs text-gray-400">2.4 MB · 20 Mar</span>
                  </div>
                  <div className="file-list-item">
                    <span className="text-gray-700">
                      <i className="fas fa-file-csv text-blue-600 mr-2"></i> existing_portfolio.csv
                    </span>
                    <span className="text-xs text-gray-400">1.1 MB · 19 Mar</span>
                  </div>
                  <div className="file-list-item">
                    <span className="text-gray-700">
                      <i className="fas fa-file-excel text-green-600 mr-2"></i> nri_clients.xlsx
                    </span>
                    <span className="text-xs text-gray-400">3.5 MB · 18 Mar</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                  <i className="fas fa-robot text-purple-600"></i> AI Mapping Preview
                </h3>
                <p className="text-sm text-gray-600 mb-3">When you upload files, our AI automatically maps fields to your client database.</p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                  <p>✅ Customer Name → clientName</p>
                  <p>✅ Email Address → primaryEmail</p>
                  <p>✅ Phone → contactPhone</p>
                  <p>✅ Investment → dealValue</p>
                  <p className="mt-3 text-green-600">
                    <i className="fas fa-check-circle"></i> 247 records ready to import
                  </p>
                  <button
                    onClick={() => alert('247 client records imported via AI mapping.')}
                    className="mt-3 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition-colors"
                  >
                    Process Import
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Section */}
          {activeSection === 'integrations' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Integrations</h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="integration-card">
                  <div className="flex items-center gap-3 mb-4">
                    <i className="fab fa-whatsapp text-3xl text-green-500"></i>
                    <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Connect your WhatsApp Business account to receive messages directly.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      className="flex-1 border p-2 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                      Connect
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Already connected? <span className="text-green-600 font-medium">Active</span>
                  </p>
                </div>

                <div className="integration-card">
                  <div className="flex items-center gap-3 mb-4">
                    <i className="fas fa-envelope text-3xl text-blue-500"></i>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Integrate your professional email to sync all client conversations.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="partner@vatika.com"
                      className="flex-1 border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Connect
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">IMAP/SMTP settings available.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-semibold mb-3 text-gray-900">How it works</h3>
                <p className="text-sm text-gray-600">Once connected, all incoming WhatsApp messages and emails from your clients will appear here. You can reply directly from the dashboard.</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="footer-powered mt-8">Powered by BURG</div>
        </div>
      </div>

      {/* Client Detail Modal */}
      {clientDetailModal && currentClient && (
        <div className="modal active">
          <div className="modal-content">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{currentClient.name}</h2>
                <i
                  className="fas fa-comment-dots message-icon text-xl cursor-pointer hover:text-yellow-500"
                  onClick={() => {
                    handleOpenMessageCompose(currentClientId);
                    handleCloseClientDetail();
                  }}
                  title="Send message"
                ></i>
              </div>
              <i
                className="fas fa-times cursor-pointer text-gray-400 hover:text-black text-xl"
                onClick={handleCloseClientDetail}
              ></i>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900 block">{currentClient.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900 block">{currentClient.phone}</span>
              </div>
              <div>
                <span className="text-gray-500">City:</span>
                <span className="font-medium text-gray-900 block">{currentClient.city}</span>
              </div>
              <div>
                <span className="text-gray-500">Investment:</span>
                <span className="font-medium text-gray-900 block">{currentClient.investment}</span>
              </div>
              <div>
                <span className="text-gray-500">Property Type:</span>
                <span className="font-medium text-gray-900 block">{currentClient.property}</span>
              </div>
              <div>
                <span className="text-gray-500">Stage:</span>
                <span className="font-medium text-gray-900 block">{currentClient.stage}</span>
              </div>
              <div>
                <span className="text-gray-500">Source:</span>
                <span className="font-medium text-gray-900 block">{currentClient.source}</span>
              </div>
              <div>
                <span className="text-gray-500">Enquiry Date:</span>
                <span className="font-medium text-gray-900 block">{currentClient.enquiryDate}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Contact:</span>
                <span className="font-medium text-gray-900 block">{currentClient.lastContact}</span>
              </div>
            </div>

            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm">
                <span className="font-medium text-gray-900">Requested Meeting:</span>{' '}
                <span className="text-gray-700">
                  {currentClient.meeting
                    ? `${currentClient.meeting.date} at ${currentClient.meeting.time} (${currentClient.meeting.mode})`
                    : 'Not scheduled'}
                </span>
              </p>
            </div>

            <div className="mb-4">
              <span className="text-gray-500 text-sm">Notes:</span>
              <p className="text-sm mt-1 bg-gray-50 p-2 rounded text-gray-700">
                {currentClient.notes || 'No notes'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                <i className="fas fa-comments text-yellow-600"></i> Client Messages
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                {currentClient.messages && currentClient.messages.length > 0 ? (
                  currentClient.messages.map((msg, idx) =>
                    msg.from === 'client' ? (
                      <div key={idx} className="message-bubble">
                        <i className="fas fa-user-circle text-gray-500 text-xl flex-shrink-0"></i>
                        <div>
                          <p className="text-sm text-gray-700">{msg.text}</p>
                          <span className="text-xs text-gray-400">{msg.time}</span>
                        </div>
                      </div>
                    ) : null
                  )
                ) : (
                  <p className="text-sm text-gray-400">No messages from client.</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAcceptEnquiry}
                className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-green-700 transition-colors"
              >
                <i className="fas fa-check"></i> Accept Enquiry
              </button>
              <button
                onClick={handleRescheduleFromClient}
                className="bg-yellow-500 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-yellow-600 transition-colors"
              >
                <i className="fas fa-exchange-alt"></i> Reschedule
              </button>
              <button
                onClick={handleRejectEnquiry}
                className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-red-600 transition-colors"
              >
                <i className="fas fa-times"></i> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Action Modal */}
      {meetingActionModal && currentMeetingClient && (
        <div className="modal active">
          <div className="modal-content">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{currentMeetingClient.name}</h2>
              <i
                className="fas fa-times cursor-pointer text-gray-400 hover:text-black text-xl"
                onClick={handleCloseMeetingAction}
              ></i>
            </div>

            <p className="text-gray-600 mb-4">
              Current meeting: {currentMeetingClient.meeting?.date} at {currentMeetingClient.meeting?.time} (
              {currentMeetingClient.meeting?.mode})
            </p>

            {!showRescheduleOptions ? (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowRescheduleOptions(true)}
                  className="bg-yellow-500 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-yellow-600 transition-colors"
                >
                  <i className="fas fa-exchange-alt"></i> Reschedule
                </button>
                <button
                  onClick={handleCancelMeeting}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-times"></i> Cancel Meeting
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold mb-3 text-gray-900">Select new date & time</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                    <input
                      type="date"
                      value={newMeetingDate}
                      onChange={(e) => setNewMeetingDate(e.target.value)}
                      className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Time</label>
                    <input
                      type="time"
                      value={newMeetingTime}
                      onChange={(e) => setNewMeetingTime(e.target.value)}
                      className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmReschedule}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowRescheduleOptions(false)}
                    className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compose Message Modal */}
      {composeMessageModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Send Message</h2>
              <i
                className="fas fa-times cursor-pointer text-gray-400 hover:text-black text-xl"
                onClick={handleCloseMessageCompose}
              ></i>
            </div>

            {composeClientId && (
              <p className="text-sm text-gray-600 mb-4">
                To: {clients.find(c => c.id === composeClientId)?.name} ({clients.find(c => c.id === composeClientId)?.email})
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Channel</label>
              <select
                value={messageChannel}
                onChange={(e) => setMessageChannel(e.target.value)}
                className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Message</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows="4"
                placeholder="Type your message..."
                className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSendMessage}
                className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
              >
                Send
              </button>
              <button
                onClick={handleCloseMessageCompose}
                className="bg-gray-300 text-gray-900 px-5 py-2 rounded-lg text-sm hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
