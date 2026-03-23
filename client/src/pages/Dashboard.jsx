import React, { useState, useEffect, useMemo } from 'react';
import { FiUsers, FiCalendar, FiBriefcase, FiTrendingUp, FiAlertCircle, FiMessageSquare, FiSettings, FiDatabase, FiCpu, FiGlobe, FiUserCheck, FiZap, FiX, FiSend, FiMapPin, FiStar, FiFileText, FiShield, FiBookOpen, FiCheckCircle, FiSearch } from 'react-icons/fi';
import { Settings as LucideSettings } from 'lucide-react';

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS (Outside Component)
// ═══════════════════════════════════════════════════
function getTodayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getOffsetDate(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateDisplay(d) {
  return new Date(d).toLocaleDateString('en-IN', { 
    day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' 
  });
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function getDealHealth(c) {
  let score = 50;
  if (c.daysSinceContact <= 1) score += 20;
  else if (c.daysSinceContact <= 3) score += 10;
  else if (c.daysSinceContact >= 7) score -= 25;
  else if (c.daysSinceContact >= 5) score -= 15;
  score += Math.round(c.probability * 0.3);
  if (c.meeting) score += 15;
  if (c.messages && c.messages.length > 0) score += 10;
  if (['Proposal', 'Negotiation', 'Meeting Accepted'].includes(c.stage)) score += 10;
  if (c.stage === 'Enquiry') score -= 5;
  score = Math.max(5, Math.min(99, score));
  return score;
}

function healthColor(score) {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#eab308';
  return '#ef4444';
}

// ═══════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════
// ═══════════════════════════════════════════════════
// CHAT MODAL COMPONENT
// ═══════════════════════════════════════════════════
// ═══════════════════════════════════════════════════
// RESCHEDULE MODAL COMPONENT
// ═══════════════════════════════════════════════════
function RescheduleModal({ client, isOpen, onClose, onConfirm }) {
  const [newDate, setNewDate] = useState(getTodayStr());
  const [newTime, setNewTime] = useState('11:00');

  if (!isOpen || !client) return null;

  const currentDate = client.meeting ? client.meeting.date : getTodayStr();
  const currentTime = client.meeting ? client.meeting.time : '11:00';

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* HEADER */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold">Reschedule Meeting</h2>
          <p className="text-sm text-gray-600 mt-2">{client.name}</p>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4">
          {/* CURRENT MEETING INFO */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm"><span className="font-semibold">Current:</span> {formatDateDisplay(currentDate)} at {currentTime} ({client.meeting?.mode || 'In-office'})</p>
          </div>

          {/* DATE PICKER */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Select new date & time</label>
            <label className="text-xs font-medium text-gray-600 block mb-2 uppercase">Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* TIME PICKER */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2 uppercase">Time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* DISPLAY SELECTED */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900"><span className="font-semibold">New meeting:</span> {formatDateDisplay(newDate)} at {newTime}</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="border-t border-gray-200 p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(newDate, newTime)}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function MeetingActionModal({ client, isOpen, onClose, onReschedule, onCancelMeeting }) {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">
            <FiX />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-semibold">Current:</span>{' '}
              {client.meeting ? `${client.meeting.date} at ${client.meeting.time} (${client.meeting.mode})` : 'Not scheduled'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onReschedule}
              className="flex-1 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition"
            >
              Reschedule
            </button>
            <button
              onClick={onCancelMeeting}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
            >
              Cancel Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InboxModal({ clients, isOpen, onClose, selectedClientId, setSelectedClientId, messagesByClient, onSendMessage }) {
  const [inboxInput, setInboxInput] = useState('');
  const inputRef = React.useRef(null);

  useEffect(() => {
    if (isOpen && !selectedClientId && clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  }, [isOpen, selectedClientId, clients, setSelectedClientId]);

  if (!isOpen) return null;

  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const activeMessages = activeClient ? (messagesByClient[activeClient.id] || []) : [];

  const handleSend = () => {
    if (!activeClient || !inboxInput.trim()) return;
    onSendMessage(activeClient.id, inboxInput.trim());
    setInboxInput('');
    // Keep focus on input after sending
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col">
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Client Inbox</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">
            <FiX />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-72 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            {clients.map(c => {
              const clientMsgs = messagesByClient[c.id] || [];
              const lastMsg = clientMsgs.length > 0 ? clientMsgs[clientMsgs.length - 1] : null;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`w-full text-left p-4 border-b border-gray-200 transition ${selectedClientId === c.id ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                >
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{c.city}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{lastMsg ? lastMsg.text : 'No messages yet'}</div>
                </button>
              );
            })}
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {activeClient ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="font-semibold">{activeClient.name}</div>
                  <div className="text-xs text-gray-600">{activeClient.phone} · {activeClient.email}</div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                  {activeMessages.length === 0 && (
                    <div className="text-sm text-gray-500">No messages yet.</div>
                  )}
                  {activeMessages.map((msg, idx) => (
                    <div key={`${activeClient.id}-${idx}`} className={`flex ${msg.from === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${msg.from === 'agent' ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-800'}`}>
                        <div>{msg.text}</div>
                        <div className="text-[10px] mt-1 opacity-70">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200 flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inboxInput}
                    onChange={(e) => setInboxInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition flex items-center gap-1"
                  >
                    <FiSend className="text-sm" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">No client selected</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatModal({ client, isOpen, onClose, chatInput, setChatInput, setMeetingPrepClient, setMeetingPrepOpen, onAddMessage, clientMessages }) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState(null); // 'accepted', 'rejected', 'rescheduled'
  const [updatedMeeting, setUpdatedMeeting] = useState(client ? client.meeting : null);

  if (!isOpen || !client) return null;

  const health = getDealHealth(client);
  const healthPercent = (health / 100) * 100;
  
  const getHealthColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBg = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getHealthReason = (score) => {
    if (score >= 70) return '✓ Meeting scheduled · High probability ↑';
    if (score >= 40) return '· Moderate interest · Follow-up needed';
    return '· Needs attention · No recent contact';
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMsg = { from: 'agent', text: chatInput, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
      onAddMessage(client.id, newMsg);
      setChatInput('');
    }
  };

  const handleAccept = () => {
    if (!updatedMeeting) return;
    setMeetingStatus('accepted');
    const acceptMsg = { from: 'agent', text: `✓ Meeting confirmed for ${formatDateDisplay(updatedMeeting.date)} at ${updatedMeeting.time} (${updatedMeeting.mode})`, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    onAddMessage(client.id, acceptMsg);
    setTimeout(() => onClose(), 1500);
  };

  const handleReject = () => {
    setMeetingStatus('rejected');
    const rejectMsg = { from: 'agent', text: '✗ Meeting declined. Will follow up soon.', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    onAddMessage(client.id, rejectMsg);
    setTimeout(() => onClose(), 1500);
  };

  const handleRescheduleConfirm = (newDate, newTime) => {
    const nextMeeting = { ...(updatedMeeting || { mode: client.meeting?.mode || 'In-office' }), date: newDate, time: newTime };
    setUpdatedMeeting(nextMeeting);
    setMeetingStatus('rescheduled');
    setRescheduleOpen(false);
    const rescheduleMsg = { from: 'agent', text: `📅 Meeting rescheduled to ${formatDateDisplay(newDate)} at ${newTime}`, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    onAddMessage(client.id, rescheduleMsg);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getHealthBg(health)}`}>
                Healthy: {health}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">
            <FiX />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5">
          {/* CONTACT INFO GRID */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600 text-xs font-medium">EMAIL</span>
              <div className="font-medium mt-1">{client.email}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600 text-xs font-medium">PHONE</span>
              <div className="font-medium mt-1">{client.phone}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600 text-xs font-medium">CITY</span>
              <div className="font-medium mt-1">{client.city}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600 text-xs font-medium">INVESTMENT</span>
              <div className="font-medium mt-1">{client.investment}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600 text-xs font-medium">PROPERTY TYPE</span>
              <div className="font-medium mt-1">{client.property}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600 text-xs font-medium">STAGE</span>
              <div className="font-medium mt-1"><span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">{client.stage}</span></div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600 text-xs font-medium">SOURCE</span>
              <div className="font-medium mt-1">{client.source}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600 text-xs font-medium">ENQUIRY DATE</span>
              <div className="font-medium mt-1">{client.enquiryDate}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600 text-xs font-medium">LAST CONTACT</span>
              <div className="font-medium mt-1">{client.lastContact}</div>
            </div>
          </div>

          {/* DEAL HEALTH SCORE */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-600 uppercase">DEAL HEALTH SCORE</span>
              <span className={`text-lg font-bold ${getHealthColor(health)}`}>{health}/100</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
              <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${healthPercent}%` }}></div>
            </div>
            <p className="text-xs text-gray-600">{getHealthReason(health)}</p>
          </div>

          {/* REQUESTED MEETING */}
          <div className={`border rounded-xl p-4 ${meetingStatus === 'accepted' ? 'bg-green-50 border-green-200' : meetingStatus === 'rejected' ? 'bg-red-50 border-red-200' : meetingStatus === 'rescheduled' ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <p className="text-sm">
              <span className="font-semibold">
                {meetingStatus === 'accepted' ? '✓ Meeting Confirmed:' : meetingStatus === 'rejected' ? '✗ Meeting Declined' : meetingStatus === 'rescheduled' ? '📅 Meeting Rescheduled:' : 'Requested Meeting:'}
              </span> 
              {meetingStatus === 'rejected' || !updatedMeeting ? '' : ` ${formatDateDisplay(updatedMeeting.date)} at ${updatedMeeting.time} (${updatedMeeting.mode})`}
            </p>
          </div>

          {/* NOTES */}
          <div>
            <span className="text-xs font-semibold text-gray-600 uppercase block mb-2">Notes</span>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">{client.notes}</div>
          </div>

          {/* MATCHED PROPERTIES */}
          <div>
            <span className="text-xs font-semibold text-gray-600 uppercase block mb-2">Matched Properties (1)</span>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">The Prestige Heights</h4>
                  <p className="text-sm text-gray-600">₹2.2–2.8Cr · Ready to move</p>
                </div>
              </div>
            </div>
          </div>

          {/* CLIENT MESSAGES */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiMessageSquare className="text-yellow-400" />
              <span className="text-sm font-semibold">Client Messages</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 max-h-40 overflow-y-auto mb-3">
              {(clientMessages || client.messages || []).map((msg, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="text-sm text-gray-800">{msg.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVITY TIMELINE */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiCalendar className="text-yellow-400" />
              <span className="text-sm font-semibold">Activity Timeline</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span>Enquiry received</span>
                <span className="text-gray-600">{client.enquiryDate}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span>Last contact</span>
                <span className="text-gray-600">{client.lastContact}</span>
              </div>
              {client.meeting && (
                <div className="flex items-center justify-between">
                  <span>Meeting: {client.meeting.time}</span>
                  <span className="text-gray-600">{client.meeting.mode}</span>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4 flex-wrap border-t border-gray-200">
            <button 
              onClick={handleAccept}
              disabled={meetingStatus !== null}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition ${meetingStatus === 'accepted' ? 'bg-green-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              <FiUserCheck className="text-sm" /> {meetingStatus === 'accepted' ? 'Meeting Accepted ✓' : 'Accept'}
            </button>
            <button 
              onClick={() => setRescheduleOpen(true)}
              disabled={meetingStatus !== null}
              className={`flex items-center gap-2 px-4 py-2 text-black rounded-lg text-sm font-medium transition ${meetingStatus === 'rescheduled' ? 'bg-yellow-500 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}
            >
              <FiCalendar className="text-sm" /> {meetingStatus === 'rescheduled' ? 'Rescheduled ✓' : 'Reschedule'}
            </button>
            <button 
              onClick={() => {
                setMeetingPrepClient(client);
                setMeetingPrepOpen(true);
              }}
              disabled={meetingStatus !== null}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${meetingStatus !== null ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              <FiBriefcase className="text-sm" /> Meeting Prep
            </button>
            <button 
              onClick={handleReject}
              disabled={meetingStatus !== null}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition ${meetingStatus === 'rejected' ? 'bg-red-700 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
            >
              <FiX className="text-sm" /> {meetingStatus === 'rejected' ? 'Meeting Declined ✗' : 'Reject'}
            </button>
          </div>

          {/* CHAT INPUT SECTION */}
          <div className="border-t border-gray-200 pt-4">
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Send Message</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition flex items-center gap-1"
              >
                <FiSend className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <RescheduleModal client={client} isOpen={rescheduleOpen} onClose={() => setRescheduleOpen(false)} onConfirm={handleRescheduleConfirm} />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MEETING PREP MODAL COMPONENT
// ═══════════════════════════════════════════════════
function MeetingPrepModal({ client, isOpen, onClose, setMeetingPrepOpen, setInboxOpen, setSelectedInboxClientId }) {
  if (!isOpen || !client) return null;

  const health = getDealHealth(client);

  // Talking points based on customer profile
  const talkingPoints = [
    `💰 Budget Confirmation: Verify the ₹${client.investment} budget is still accurate and discuss financing options.`,
    `📈 Market Appreciation: Highlight 8-12% annual appreciation in ${client.city} properties.`,
    `👥 Decision Timeline: Understand if this is a personal/family investment and identify decision-makers.`,
    `🏘️ Property Match: The Prestige Heights offers best ROI in the ₹2.2–2.8Cr bracket matching their profile.`
  ];

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{client.name}</h2>
            <p className="text-sm text-gray-600">
              <FiMapPin className="inline mr-1" /> {client.city} · {client.investment} · 
              {client.meeting ? ` ${formatDateDisplay(client.meeting.date)} at ${client.meeting.time}` : ' No meeting scheduled'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">
            <FiX />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* CLIENT BRIEF */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiUserCheck className="text-yellow-400 text-lg" />
              <h3 className="text-lg font-bold">Client Brief</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">Property Interest</span>
                <p className="text-sm font-medium">{client.property}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">Budget</span>
                <p className="text-sm font-medium">{client.investment}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">Deal Stage</span>
                <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">{client.stage}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-xs font-semibold text-gray-600 uppercase block mb-1">Lead Source</span>
                <p className="text-sm font-medium">{client.source}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                <span className="text-xs font-semibold text-gray-600 uppercase block mb-2">Deal Health</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-300 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${health >= 70 ? 'bg-green-500' : health >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                      style={{ width: `${(health / 100) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`font-bold text-sm ${health >= 70 ? 'text-green-600' : health >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{health}/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* TALKING POINTS */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiStar className="text-yellow-400 text-lg" />
              <h3 className="text-lg font-bold">Talking Points</h3>
            </div>
            <div className="space-y-3">
              {talkingPoints.map((point, idx) => (
                <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="text-gray-800">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MATCHED PROPERTIES */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiBriefcase className="text-yellow-400 text-lg" />
              <h3 className="text-lg font-bold">Best Matched Properties</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">The Prestige Heights</h4>
                    <p className="text-xs text-gray-600 mt-1">₹2.2–2.8Cr · Ready to move · 3BHK/4BHK · {client.city}</p>
                    <div className="mt-2 text-xs text-gray-700">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded mr-2 font-medium">Prime Location</span>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">Best ROI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiMessageSquare className="text-yellow-400 text-lg" />
              <h3 className="text-lg font-bold">Notes</h3>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <p className="text-gray-800">{client.notes}</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4 flex-wrap border-t border-gray-200">
            <button 
              onClick={() => {
                setMeetingPrepOpen(false);
                setSelectedInboxClientId(client.id);
                setInboxOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition"
            >
              <FiMessageSquare className="text-sm" /> Message Client
            </button>
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              <FiX className="text-sm" /> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeSection, setActiveSection, setModalOpen, profileData, currentTheme, leftDualTheme }) {
  const sidebarThemeClass = leftDualTheme
    ? leftDualTheme
    : currentTheme === 'dark'
    ? 'from-gray-900 to-black'
    : currentTheme === 'blue'
      ? 'from-blue-900 to-sky-800'
      : currentTheme === 'green'
        ? 'from-emerald-900 to-emerald-700'
        : 'from-blue-900 to-blue-950';

  return (
    <aside className={`w-64 bg-linear-to-r ${sidebarThemeClass} text-white flex flex-col`} style={{ minWidth: '256px' }}>
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-400">
            <span className="text-black font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold">BURGHUB</span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-1">
        {[
          { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
          { id: 'pipeline', label: 'Pipeline', icon: 'fas fa-columns' },
          { id: 'clients', label: 'Clients', icon: 'fas fa-users' },
          { id: 'inbox', label: 'Inbox', icon: 'fas fa-inbox' },
          { id: 'meetings', label: 'Meetings', icon: 'fas fa-calendar-check' },
          { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
          { id: 'datahub', label: 'Data Hub', icon: 'fas fa-database' },
          { id: 'integrations', label: 'Integrations', icon: 'fas fa-plug' },
        ].map(item => (
          <div
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition ${
              activeSection === item.id 
                ? 'bg-blue-800/60 border-l-4 border-yellow-400' 
                : 'hover:bg-blue-800/40'
            }`}
          >
            <i className={`${item.icon} w-5`}></i>
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-white border-opacity-10">
        <button
          onClick={() => setModalOpen(prev => ({ ...prev, settings: true }))}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-blue-800/40 transition text-sm"
        >
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </button>
      </div>

      <div className="border-t border-white border-opacity-10 px-5 py-4">
        <div className="flex items-center gap-3">
          {profileData.photo ? (
            <img
              src={profileData.photo}
              alt="Profile"
              className="w-9 h-9 rounded-xl object-cover border-2 border-yellow-400 bg-white"
              style={{ minWidth: 36, minHeight: 36 }}
            />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-bold text-sm bg-yellow-400">{profileData.displayName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}</div>
          )}
          <div>
            <div className="font-medium text-sm">{profileData.orgName}</div>
            <div className="text-xs text-gray-300">Enterprise Partner</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════
function Header({ searchQuery, setSearchQuery, clients, setModalOpen, currentDate, currentTheme }) {
  const atRiskCount = clients.filter(c => getDealHealth(c) < 40).length;
  const headerClass = currentTheme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-200';
  const searchInputClass = currentTheme === 'dark'
    ? 'w-full pl-9 pr-8 py-2.5 rounded-xl text-sm bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-yellow-400'
    : 'w-full pl-9 pr-8 py-2.5 rounded-xl text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-yellow-400';
  const pillClass = currentTheme === 'dark'
    ? 'text-sm font-medium px-3 py-2 rounded-xl border border-gray-700 bg-gray-800 text-gray-300'
    : 'text-sm font-medium px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600';
  
  return (
    <header className={`border-b px-6 py-3 flex items-center justify-between ${headerClass}`}>
      <div className="relative w-80">
        <FiSearch className="absolute left-3 top-3 text-gray-500" style={{ fontSize: '0.8rem' }} />
        <input
          type="text"
          placeholder="Search clients…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={searchInputClass}
        />
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setModalOpen(prev => ({ ...prev, followup: true }))}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-gray-50 text-gray-900 hover:border-yellow-400 transition relative"
        >
          <FiCpu className="text-purple-600" /> AI Follow-ups
          {atRiskCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold -mr-2 -mt-2">
              {atRiskCount}
            </span>
          )}
        </button>

        <div className={pillClass}>
          <FiCalendar className="mr-1 inline text-yellow-400" />
          <span>{formatDateDisplay(currentDate)}</span>
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════
// SETTINGS MODAL COMPONENT
// ═══════════════════════════════════════════════════
function SettingsModal({ modalOpen, setModalOpen, settingsPanel, setSettingsPanel, profileData, setProfileData, currentTheme, setCurrentTheme, leftDualTheme, setLeftDualTheme, rightDualTheme, setRightDualTheme, onExportCsv, onExportExcel }) {
  const [draftProfile, setDraftProfile] = useState(profileData);
  const [photo, setPhoto] = useState(profileData.photo || null);

  // Handle photo upload and preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!modalOpen.settings) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-11/12 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative">
        {/* Close Button Top Right */}
        <button
          onClick={() => setModalOpen(prev => ({ ...prev, settings: false }))}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl z-50 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Close settings"
        >
          <FiX />
        </button>
        <div className="flex h-full">
          {/* Settings Sidebar */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-yellow-400">
                <LucideSettings size={20} color="#000" />
              </div>
              <span className="font-bold text-sm">Settings</span>
            </div>
            {['profile', 'theme', 'security', 'notifications', 'data', 'terms'].map(panel => (
              <div
                key={panel}
                onClick={() => setSettingsPanel(panel)}
                className={`px-4 py-2.5 rounded-lg cursor-pointer text-sm flex items-center gap-2 transition ${
                  settingsPanel === panel
                    ? 'bg-yellow-400 text-black font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className={`fas ${
                  panel === 'profile' ? 'fa-user-circle' :
                  panel === 'theme' ? 'fa-palette' :
                  panel === 'security' ? 'fa-shield-alt' :
                  panel === 'notifications' ? 'fa-bell' :
                  panel === 'data' ? 'fa-database' :
                  'fa-file-contract'
                } w-4`}></i>
                {panel.charAt(0).toUpperCase() + panel.slice(1)}
              </div>
            ))}
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {settingsPanel === 'profile' && (
              <div>
                <h2 className="text-xl font-bold mb-1">Profile</h2>
                <p className="text-sm text-gray-600 mb-6">Manage your account information.</p>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {photo ? (
                        <img
                          src={photo}
                          alt="Profile"
                          className="w-12 h-12 rounded-xl object-cover border border-yellow-400"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-yellow-400 text-black font-bold flex items-center justify-center">
                          {draftProfile.displayName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{draftProfile.orgName}</div>
                        <div className="text-xs text-gray-600">Enterprise Partner · Active</div>
                      </div>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="profile-photo-input"
                        style={{ display: 'none' }}
                        onChange={handlePhotoChange}
                      />
                      <button
                        className="px-3 py-2 text-sm font-medium border border-gray-200 bg-white rounded-lg hover:bg-gray-100 transition"
                        onClick={() => document.getElementById('profile-photo-input').click()}
                        type="button"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Organisation Name</label>
                      <input type="text" value={draftProfile.orgName} onChange={(e) => setDraftProfile({ ...draftProfile, orgName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Display Name</label>
                      <input type="text" value={draftProfile.displayName} onChange={(e) => setDraftProfile({ ...draftProfile, displayName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Email Address</label>
                      <input type="email" value={draftProfile.email} onChange={(e) => setDraftProfile({ ...draftProfile, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Phone Number</label>
                      <input type="text" value={draftProfile.phone} onChange={(e) => setDraftProfile({ ...draftProfile, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">City</label>
                      <input type="text" value={draftProfile.city} onChange={(e) => setDraftProfile({ ...draftProfile, city: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Timezone</label>
                      <input type="text" value={draftProfile.timezone} onChange={(e) => setDraftProfile({ ...draftProfile, timezone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Bio</label>
                    <textarea value={draftProfile.bio} onChange={(e) => setDraftProfile({ ...draftProfile, bio: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
                  </div>
                </div>
              </div>
            )}

            {settingsPanel === 'theme' && (
              <div>
                <h2 className="text-xl font-bold mb-1">Appearance</h2>
                <p className="text-sm text-gray-600 mb-6">Customise how BURG Hub looks.</p>
                {/* Only show default and dark themes */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                  {['default', 'dark'].map(t => (
                    <button
                      key={t}
                      onClick={() => setCurrentTheme(t)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition text-left w-full ${currentTheme === t ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-yellow-200'}`}
                    >
                      <div className="text-sm font-semibold capitalize">{t} Theme</div>
                      <div className="text-xs text-gray-600 mt-1">{currentTheme === t ? 'Selected' : 'Click to apply'}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Left Section Dual Color Theme</h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                      {[
                        { id: 'from-blue-900 to-blue-950', name: 'Navy Night' },
                        { id: 'from-indigo-900 to-purple-900', name: 'Indigo Plum' },
                        { id: 'from-emerald-900 to-teal-800', name: 'Emerald Teal' },
                        { id: 'from-slate-900 to-gray-800', name: 'Slate Graphite' },
                      ].map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setLeftDualTheme(theme.id)}
                          className={`p-2.5 border rounded-lg text-left transition w-full ${leftDualTheme === theme.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-yellow-200'}`}
                        >
                          <div className={`h-4 rounded bg-linear-to-r ${theme.id} mb-1`}></div>
                          <div className="text-xs font-medium">{theme.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Right Section Dual Color Theme</h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                      {[
                        { id: 'from-gray-50 to-gray-100', name: 'Soft Gray' },
                        { id: 'from-blue-50 to-cyan-100', name: 'Sky Mist' },
                        { id: 'from-emerald-50 to-lime-100', name: 'Mint Lime' },
                        { id: 'from-amber-50 to-orange-100', name: 'Sunrise Sand' },
                      ].map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setRightDualTheme(theme.id)}
                          className={`p-2.5 border rounded-lg text-left transition w-full ${rightDualTheme === theme.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-yellow-200'}`}
                        >
                          <div className={`h-4 rounded bg-linear-to-r ${theme.id} mb-1`}></div>
                          <div className="text-xs font-medium">{theme.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {settingsPanel === 'security' && (
              <div>
                <h2 className="text-xl font-bold mb-1">Security</h2>
                <p className="text-sm text-gray-600 mb-6">Password and account security.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  </div>
                </div>
              </div>
            )}

            {settingsPanel === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold mb-1">Notifications</h2>
                <p className="text-sm text-gray-600 mb-6">Control when and how you receive alerts.</p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-3">In-App Notifications</h3>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">New client enquiry</div>
                          <div className="text-xs text-gray-600 mt-1">Alert when a new lead comes in</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 mt-1" />
                      </div>

                      <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">Meeting reminder (1 hr before)</div>
                          <div className="text-xs text-gray-600 mt-1">Reminder before each meeting</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 mt-1" />
                      </div>

                      <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">Deal going cold alert</div>
                          <div className="text-xs text-gray-600 mt-1">Health score drops below 40</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 mt-1" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-3">Email Digest</h3>
                    <div className="space-y-2">
                      {['Daily summary (7:00 AM)', 'Weekly (Monday)', 'Disabled'].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm">
                          <input type="radio" name="email-digest" defaultChecked={option === 'Daily summary (7:00 AM)'} className="w-4 h-4" />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {settingsPanel === 'data' && (
              <div>
                <h2 className="text-xl font-bold mb-1">Data & Privacy</h2>
                <p className="text-sm text-gray-600 mb-6">Control your data, exports, and retention.</p>

                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <h3 className="font-semibold mb-1">Export Your Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Download all client records, meeting logs, and activity history.</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={onExportCsv} className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition">Export as CSV</button>
                      <button onClick={onExportExcel} className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-100 transition">Export as Excel</button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <h3 className="font-semibold mb-1">Data Retention</h3>
                    <p className="text-sm text-gray-600 mb-3">How long inactive records are kept before auto-archiving.</p>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50">
                      <option>12 months (recommended)</option>
                      <option>6 months</option>
                      <option>24 months</option>
                      <option>Never auto-archive</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <h3 className="font-semibold text-red-700 mb-1">Danger Zone</h3>
                    <p className="text-sm text-red-600 mb-4">These actions are irreversible.</p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="px-4 py-2 border border-red-300 bg-white text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition">Delete Account</button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Purge All Client Data</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {settingsPanel === 'terms' && (
              <div>
                <h2 className="text-xl font-bold mb-1">Terms & Legal</h2>
                <p className="text-sm text-gray-600 mb-6">Review agreements governing your use of BURG Partner Hub.</p>

                <div className="space-y-4">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FiFileText className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Terms of Service</h3>
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">v3.2 · Accepted</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Usage rights, prohibited activities, 99.5% SLA, IP ownership, and dispute resolution under Indian law.</p>
                        <button className="text-sm text-yellow-500 font-medium hover:underline mt-2">Read full document →</button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                        <FiShield className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Privacy Policy</h3>
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">v2.1 · Current</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Data stored on AWS Mumbai, AES-256 at rest, TLS 1.3 in transit. We never sell your data.</p>
                        <button className="text-sm text-yellow-500 font-medium hover:underline mt-2">Read full document →</button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <FiBookOpen className="text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Partner Agreement</h3>
                          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-medium">Enterprise</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Commission structures, 48-hr lead exclusivity, co-marketing rights, and annual auto-renewing terms.</p>
                        <button className="text-sm text-yellow-500 font-medium hover:underline mt-2">View signed agreement →</button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <h3 className="font-semibold mb-3">Compliance</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['DPDP Act 2023 Compliant', 'ISO 27001 Certified', 'SOC 2 Type II Audited', 'RBI NBFC Guideline'].map(item => (
                        <div key={item} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-white border border-gray-200">
                          <FiCheckCircle className="text-green-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-end gap-2">
          {settingsPanel === 'profile' ? (
            <>
              <button
                onClick={() => {
                  setDraftProfile(profileData);
                  setPhoto(profileData.photo || null);
                  setModalOpen(prev => ({ ...prev, settings: false }));
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setProfileData({ ...draftProfile, photo });
                  setModalOpen(prev => ({ ...prev, settings: false }));
                }}
                className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-semibold hover:bg-yellow-500 transition"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setModalOpen(prev => ({ ...prev, settings: false }))}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════
const Dashboard = () => {
  // Persist activeSection in localStorage
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('burg_active_section') || 'overview';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Save activeSection to localStorage on change
  useEffect(() => {
    localStorage.setItem('burg_active_section', activeSection);
  }, [activeSection]);
  const [stageFilter, setStageFilter] = useState('');
  const [modalOpen, setModalOpen] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settingsPanel, setSettingsPanel] = useState('profile');
  const [chatOpen, setChatOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [selectedChatClient, setSelectedChatClient] = useState(null);
  const [selectedInboxClientId, setSelectedInboxClientId] = useState(null);
  const [selectedMeetingClientId, setSelectedMeetingClientId] = useState(null);
  const [meetingActionOpen, setMeetingActionOpen] = useState(false);
  const [meetingRescheduleOpen, setMeetingRescheduleOpen] = useState(false);
  const [draggedClientId, setDraggedClientId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [meetingPrepOpen, setMeetingPrepOpen] = useState(false);
  const [meetingPrepClient, setMeetingPrepClient] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [leftDualTheme, setLeftDualTheme] = useState('from-blue-900 to-blue-950');
  const [rightDualTheme, setRightDualTheme] = useState('from-gray-50 to-gray-100');
  const [profileData, setProfileData] = useState({
    orgName: 'Vatika Group',
    displayName: 'VG Admin',
    email: 'admin@vatika.com',
    phone: '+91 98765 43210',
    city: 'Gurugram',
    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
    bio: 'Premium real estate partner specialising in luxury and commercial properties across NCR.',
  });
  const [inboxSectionInput, setInboxSectionInput] = useState('');

  const initialClients = useMemo(() => [
    { id: 1, name: 'Rajesh Sharma', email: 'rajesh.s@example.com', phone: '+91 98765 43210', city: 'Gurugram', investment: '₹2.4Cr', investVal: 240, property: 'Residential', stage: 'Negotiation', probability: 85, agent: 'Arjun Mehta', meeting: { date: getTodayStr(), time: '16:00', mode: 'Video call' }, source: 'Landing Page', enquiryDate: '15 Mar 2026', lastContact: getTodayStr(), daysSinceContact: 0, notes: 'Interested in Golf Course road. Budget flexible.', messages: [{ from: 'client', text: 'Hi, I\'m interested in luxury properties in Gurugram. When can we discuss?', time: '10:30 AM' }] },
    { id: 2, name: 'Priya Singh', email: 'priya.s@example.com', phone: '+91 98765 22222', city: 'Mumbai', investment: '₹3.8Cr', investVal: 380, property: 'Commercial', stage: 'Proposal', probability: 72, agent: 'Arjun Mehta', meeting: { date: getTodayStr(), time: '11:00', mode: 'In-office' }, source: 'Landing Page', enquiryDate: '16 Mar 2026', lastContact: getOffsetDate(-1), daysSinceContact: 1, notes: 'Office space in Bandra. Need 2000 sq ft.', messages: [] },
    { id: 3, name: 'Amit Verma', email: 'amit.v@example.com', phone: '+91 98765 11111', city: 'Delhi', investment: '₹85L', investVal: 85, property: 'Residential', stage: 'Qualified', probability: 45, agent: 'Sneha Kapoor', meeting: { date: getOffsetDate(4), time: '15:00', mode: 'Phone call' }, source: 'Referral', enquiryDate: '14 Mar 2026', lastContact: getOffsetDate(-3), daysSinceContact: 3, notes: 'First-time buyer. Prefers Noida extension.', messages: [] },
    { id: 4, name: 'Neha Kapoor', email: 'neha.k@example.com', phone: '+91 98765 55555', city: 'Bangalore', investment: '₹1.2Cr', investVal: 120, property: 'Luxury', stage: 'New', probability: 20, agent: 'Ravi Das', meeting: { date: getOffsetDate(2), time: '10:00', mode: 'Video call' }, source: 'Landing Page', enquiryDate: '17 Mar 2026', lastContact: getOffsetDate(-1), daysSinceContact: 1, notes: 'Villas near Whitefield. Site visited once.', messages: [] },
    { id: 5, name: 'Rohan Gupta', email: 'rohan.g@example.com', phone: '+91 98765 12345', city: 'Lucknow', investment: '₹1.5Cr', investVal: 150, property: 'Residential', stage: 'Enquiry', probability: 10, agent: 'Sneha Kapoor', meeting: { date: getOffsetDate(3), time: '14:00', mode: 'Video call' }, source: 'Landing Page', enquiryDate: '19 Mar 2026', lastContact: getOffsetDate(-4), daysSinceContact: 4, notes: '4BHK in Gomti Nagar.', messages: [] },
    { id: 6, name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 98765 67890', city: 'Hyderabad', investment: '₹2.2Cr', investVal: 220, property: 'Commercial', stage: 'Enquiry', probability: 15, agent: 'Arjun Mehta', meeting: { date: getOffsetDate(3), time: '11:30', mode: 'Phone call' }, source: 'Landing Page', enquiryDate: '19 Mar 2026', lastContact: getOffsetDate(-4), daysSinceContact: 4, notes: 'Office space in Hitec City.', messages: [] },
  ], []);

  const [clients, setClients] = useState(initialClients);

  const [messagesByClient, setMessagesByClient] = useState(() =>
    Object.fromEntries(clients.map(c => [c.id, c.messages || []]))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAddMessage = (clientId, msg) => {
    setMessagesByClient(prev => {
      const current = prev[clientId] || [];
      return { ...prev, [clientId]: [...current, msg] };
    });
  };

  const handleInboxSendMessage = (clientId, text) => {
    const msg = {
      from: 'agent',
      text,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    handleAddMessage(clientId, msg);
  };

  const handlePipelineDrop = (targetStage, droppedClientId) => {
    if (!droppedClientId) return;
    setClients(prev => prev.map(c => (c.id === droppedClientId ? { ...c, stage: targetStage } : c)));
    setDraggedClientId(null);
    setDragOverStage('');
  };

  const activeMeetingClient = clients.find(c => c.id === selectedMeetingClientId) || null;

  const openMeetingActions = (clientId) => {
    setSelectedMeetingClientId(clientId);
    setMeetingActionOpen(true);
  };

  const handleMeetingRescheduleConfirm = (newDate, newTime) => {
    if (!selectedMeetingClientId) return;
    setClients(prev => prev.map(c => {
      if (c.id !== selectedMeetingClientId) return c;
      const mode = c.meeting?.mode || 'In-office';
      return { ...c, meeting: { date: newDate, time: newTime, mode } };
    }));
    setMeetingRescheduleOpen(false);
    setMeetingActionOpen(false);
  };

  const handleCancelMeeting = () => {
    if (!selectedMeetingClientId) return;
    setClients(prev => prev.map(c => (c.id === selectedMeetingClientId ? { ...c, meeting: null } : c)));
    setMeetingActionOpen(false);
  };

  const getExportRows = () => {
    return clients.map(c => ({
      clientName: c.name,
      city: c.city,
      primaryEmail: c.email,
      contactPhone: c.phone,
      source: c.source,
      propertyType: c.property,
      dealValue: c.investment,
      stage: c.stage,
      healthScore: getDealHealth(c),
      enquiryDate: c.enquiryDate,
      lastContact: c.lastContact,
      nextMeetingDate: c.meeting ? c.meeting.date : '',
      nextMeetingTime: c.meeting ? c.meeting.time : '',
      nextMeetingMode: c.meeting ? c.meeting.mode : '',
      notes: c.notes,
    }));
  };

  const triggerDownload = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const rows = getExportRows();
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const escapeCsv = (value) => {
      const str = String(value ?? '');
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const csv = [
      headers.join(','),
      ...rows.map(row => headers.map(h => escapeCsv(row[h])).join(','))
    ].join('\n');
    triggerDownload(`\uFEFF${csv}`, `burg-client-export-${getTodayStr()}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleExportExcel = () => {
    const rows = getExportRows();
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const htmlTable = `
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(row => `<tr>${headers.map(h => `<td>${String(row[h] ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    `;
    const excelContent = `<!DOCTYPE html><html><head><meta charset="UTF-8" /></head><body>${htmlTable}</body></html>`;
    triggerDownload(excelContent, `burg-client-export-${getTodayStr()}.xls`, 'application/vnd.ms-excel');
  };

  // ═══════════════════════════════════════════════════
  // RENDER SECTIONS
  // ═══════════════════════════════════════════════════
  
  const Overview = () => {
    const clientsNotContacted5Days = clients.filter(c => c.daysSinceContact >= 5);
    const todayMeetings = clients.filter(c => c.meeting && c.meeting.date === getTodayStr());
    const highProbabilityDeals = clients.filter(c => c.probability >= 70 && ['Proposal', 'Negotiation', 'Meeting Accepted'].includes(c.stage));
    const landingPageLeads = clients.filter(c => c.source === 'Landing Page').length;
    const referralLeads = clients.filter(c => c.source === 'Referral').length;

    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-2xl font-bold">Executive Overview</h1>
            <p className="text-sm mt-0.5 text-gray-600">{getGreeting()}, {profileData.orgName}</p>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-5 gap-4 mb-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="text-blue-500 text-xl" />
              <div className="text-xs font-medium uppercase tracking-wide text-gray-600">Clients</div>
            </div>
            <div className="text-2xl font-bold mt-1">{clients.length}</div>
            <div className="text-xs text-green-600 mt-0.5">+12 this week</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <FiCalendar className="text-purple-500 text-xl" />
              <div className="text-xs font-medium uppercase tracking-wide text-gray-600">Meetings (Today)</div>
            </div>
            <div className="text-2xl font-bold mt-1">{todayMeetings.length}</div>
            <div className="text-xs text-green-600 mt-0.5">↑ 8% vs last month</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <FiBriefcase className="text-green-500 text-xl" />
              <div className="text-xs font-medium uppercase tracking-wide text-gray-600">Opportunities</div>
            </div>
            <div className="text-2xl font-bold mt-1">43</div>
            <div className="text-xs text-gray-600 mt-0.5">₹12.8Cr pipeline</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="text-orange-500 text-xl" />
              <div className="text-xs font-medium uppercase tracking-wide text-gray-600">Conversion</div>
            </div>
            <div className="text-2xl font-bold mt-1">23.8%</div>
            <div className="text-xs text-gray-600 mt-0.5">Avg: 18.2%</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition cursor-pointer" onClick={() => setModalOpen(prev => ({ ...prev, followup: true }))}>
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="text-red-500 text-xl" />
              <div className="text-xs font-medium uppercase tracking-wide text-gray-600">Deals at Risk</div>
            </div>
            <div className="text-2xl font-bold mt-1 text-red-500">{clients.filter(c => getDealHealth(c) < 40).length}</div>
            <div className="text-xs text-red-500 mt-0.5">Needs action</div>
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div className="bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiCpu className="text-purple-600 text-lg" />
            <h2 className="text-lg font-bold">AI Insights</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Clients Not Contacted */}
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100">
                  <FiAlertCircle className="text-red-600 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-600 uppercase">5+ Days No Contact</div>
                  <div className="text-2xl font-bold mt-1">{clientsNotContacted5Days.length}</div>
                  <div className="text-xs text-gray-600 mt-1">{clientsNotContacted5Days.map(c => c.name).join(', ')}</div>
                </div>
              </div>
            </div>

            {/* Today's Meetings */}
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                  <FiCalendar className="text-blue-600 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-600 uppercase">Meetings Today</div>
                  <div className="text-2xl font-bold mt-1">{todayMeetings.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Prepare briefs for {todayMeetings.map(c => c.name).join(', ')}</div>
                </div>
              </div>
            </div>

            {/* High Probability Deals */}
            <div className="bg-white rounded-xl p-4 border border-green-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
                  <FiZap className="text-green-600 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-600 uppercase">Ready to Close</div>
                  <div className="text-2xl font-bold mt-1">{highProbabilityDeals.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Prioritise {highProbabilityDeals.slice(0, 1).map(c => c.name).join(', ')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEAD SOURCES & TODAY'S MEETINGS */}
        <div className="grid grid-cols-2 gap-4">
          {/* Lead Sources */}
          <div className="rounded-2xl p-6 border border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Lead Sources</h3>
              <a href="#" className="text-xs text-yellow-400 font-medium hover:underline">Full report →</a>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <FiGlobe className="text-yellow-400 text-lg" />
                  <div>
                    <div className="text-sm font-semibold">Landing Page</div>
                    <div className="text-xs text-gray-600">{landingPageLeads} leads</div>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-700">{landingPageLeads}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <FiUserCheck className="text-blue-400 text-lg" />
                  <div>
                    <div className="text-sm font-semibold">Referral</div>
                    <div className="text-xs text-gray-600">{referralLeads} leads</div>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-700">{referralLeads}</span>
              </div>
            </div>
          </div>

          {/* Today's Meetings */}
          <div className="rounded-2xl p-6 border border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Today's Meetings</h3>
              <span className="text-xs font-medium text-yellow-400 flex items-center gap-1"><FiCalendar className="text-sm" /> {formatDateDisplay(currentDate)}</span>
            </div>
            <div className="space-y-2">
              {todayMeetings.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-gray-600">{c.meeting.time} · {c.meeting.mode}</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Today</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT CLIENTS WITH CONTACT INFO & CHAT */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 flex justify-between">
            <h3 className="font-semibold text-sm">Recent Clients</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase">Stage</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase">Last Contact</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase">Next Meeting</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase">Health</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.slice(0, 5).map(c => {
                const health = getDealHealth(c);
                return (
                  <tr
                    key={c.id}
                    onClick={() => {
                      setSelectedChatClient(c);
                      setChatOpen(true);
                      setChatInput('');
                    }}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-gray-600">{c.city}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{c.investment}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{c.stage}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.daysSinceContact === 0 ? 'Today' : `${c.daysSinceContact} days ago`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.meeting ? `${formatDateDisplay(c.meeting.date)} ${c.meeting.time}` : 'Not scheduled'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: healthColor(health) }}></div>
                        <span className="text-xs font-medium">{health}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInboxClientId(c.id);
                          setInboxOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black rounded-lg text-xs font-medium hover:bg-yellow-500 transition cursor-pointer"
                      >
                        <FiMessageSquare className="text-sm" /> Chat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const PipelineSection = () => {
    const STAGES = ['Enquiry', 'New', 'Qualified', 'Proposal', 'Negotiation', 'Meeting Accepted'];
    const pipelineTotal = clients.reduce((sum, c) => sum + c.investVal, 0);

    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold">Pipeline</h2>
            <p className="text-sm mt-0.5 text-gray-600">Drag cards to move clients across stages</p>
          </div>
          <div className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
            ₹{pipelineTotal}L total pipeline
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {STAGES.map(stage => {
            const stageClients = clients.filter(c => c.stage === stage);
            const stageValue = stageClients.reduce((sum, c) => sum + c.investVal, 0);

            return (
              <div
                key={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverStage(stage);
                }}
                onDragLeave={() => setDragOverStage(prev => (prev === stage ? '' : prev))}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedId = Number(e.dataTransfer.getData('text/plain')) || draggedClientId;
                  handlePipelineDrop(stage, droppedId);
                }}
                className={`rounded-xl p-4 border min-h-96 overflow-y-auto transition ${dragOverStage === stage ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{stage}</span>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                    {stageClients.length}
                  </span>
                </div>
                <div className="text-xs mb-3 font-medium text-gray-600">₹{stageValue}L</div>
                <div className="space-y-2">
                  {stageClients.map(c => {
                    const health = getDealHealth(c);
                    return (
                      <div
                        key={c.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', String(c.id));
                          setDraggedClientId(c.id);
                        }}
                        onDragEnd={() => {
                          setDraggedClientId(null);
                          setDragOverStage('');
                        }}
                        onClick={() => {
                          setSelectedChatClient(c);
                          setChatOpen(true);
                          setChatInput('');
                        }}
                        className="bg-white border border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm">{c.name}</span>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: healthColor(health) }}></div>
                        </div>
                        <div className="text-xs text-gray-600 mb-1.5">{c.city} · {c.property}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold">{c.investment}</span>
                          <span className="text-xs text-gray-600">{c.probability}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ClientsList = () => {
    const filtered = searchQuery
      ? clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : clients;

    const filteredByStage = stageFilter ? filtered.filter(c => c.stage === stageFilter) : filtered;

    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Clients</h2>
          <div className="flex items-center gap-3">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
            >
              <option value="">All Stages</option>
              <option>Enquiry</option>
              <option>New</option>
              <option>Qualified</option>
              <option>Proposal</option>
              <option>Negotiation</option>
              <option>Meeting Accepted</option>
            </select>
            <div className="text-sm text-gray-600">{filteredByStage.length} clients</div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Health</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Enquiry</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Next Meeting</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredByStage.map(c => {
                const health = getDealHealth(c);
                return (
                  <tr
                    key={c.id}
                    onClick={() => {
                      setSelectedChatClient(c);
                      setChatOpen(true);
                      setChatInput('');
                    }}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-gray-600">{c.city}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{c.email}</div>
                      <div className="text-xs text-gray-600">{c.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{c.source}</td>
                    <td className="px-4 py-3 text-sm">{c.property}</td>
                    <td className="px-4 py-3 text-sm font-medium">{c.investment}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{c.stage}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: healthColor(health) }}></div>
                        <span className="text-xs font-medium">{health}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.enquiryDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.lastContact}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {c.meeting ? (
                        <>
                          <div>{c.meeting.date}</div>
                          <div className="text-xs text-gray-600">{c.meeting.time}</div>
                        </>
                      ) : (
                        'Not scheduled'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInboxClientId(c.id);
                          setActiveSection('inbox');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black rounded-lg text-xs font-medium hover:bg-yellow-500 transition"
                      >
                        <FiMessageSquare className="text-sm" /> Chat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const InboxSection = () => {
    const activeClient = clients.find(c => c.id === selectedInboxClientId) || clients[0] || null;
    const activeMessages = activeClient ? (messagesByClient[activeClient.id] || []) : [];
    const inputRef = React.useRef(null);

    // Use a controlled input, value and setter from Dashboard state
    const handleSend = () => {
      if (!activeClient || !inboxSectionInput.trim()) return;
      handleInboxSendMessage(activeClient.id, inboxSectionInput.trim());
      setInboxSectionInput('');
      if (inputRef.current) inputRef.current.focus();
    };

    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Inbox</h2>
          <div className="text-sm text-gray-600">All client chats in one place</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden h-[70vh] flex min-h-0">
          <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            {clients.map(c => {
              const clientMsgs = messagesByClient[c.id] || [];
              const lastMsg = clientMsgs.length > 0 ? clientMsgs[clientMsgs.length - 1] : null;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedInboxClientId(c.id)}
                  className={`w-full text-left p-4 border-b border-gray-200 transition ${selectedInboxClientId === c.id ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{c.name}</div>
                    <span className="text-[11px] text-gray-500">{clientMsgs.length}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">{c.city}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{lastMsg ? lastMsg.text : 'No messages yet'}</div>
                </button>
              );
            })}
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {activeClient ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="font-semibold">{activeClient.name}</div>
                  <div className="text-xs text-gray-600">{activeClient.phone} · {activeClient.email}</div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                  {activeMessages.length === 0 && (
                    <div className="text-sm text-gray-500">No messages yet.</div>
                  )}
                  {activeMessages.map((msg, idx) => (
                    <div key={`${activeClient.id}-${idx}`} className={`flex ${msg.from === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${msg.from === 'agent' ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-800'}`}>
                        <div>{msg.text}</div>
                        <div className="text-[10px] mt-1 opacity-70">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200 flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inboxSectionInput}
                    onChange={(e) => setInboxSectionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
                    autoComplete="off"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition flex items-center gap-1"
                  >
                    <FiSend className="text-sm" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">No client selected</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MeetingsSection = () => (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Meetings</h2>
        <div className="text-sm font-medium px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600">
          <i className="fas fa-calendar mr-1"></i> {formatDateDisplay(currentDate)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 border border-gray-200 bg-white">
          <h3 className="font-semibold mb-4">Today's Meetings</h3>
          <ul className="space-y-3">
            {clients
              .filter(c => c.meeting && c.meeting.date === getTodayStr())
              .map(c => (
                <li
                  key={c.id}
                  onClick={() => openMeetingActions(c.id)}
                  className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
                >
                  <div>
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-gray-600">{c.meeting.time} · {c.meeting.mode}</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Today</span>
                </li>
              ))}
          </ul>
        </div>

        <div className="rounded-2xl p-5 border border-gray-200 bg-white">
          <h3 className="font-semibold mb-4">Upcoming Meetings</h3>
          <ul className="space-y-3">
            {clients
              .filter(c => c.meeting && c.meeting.date > getTodayStr())
              .slice(0, 5)
              .map(c => (
                <li
                  key={c.id}
                  onClick={() => openMeetingActions(c.id)}
                  className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
                >
                  <div>
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-gray-600">{c.meeting.date} · {c.meeting.time}</div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Scheduled</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const AnalyticsSection = () => {
    const totalClients = clients.length;
    const totalPipelineValue = clients.reduce((sum, c) => sum + c.investVal, 0);
    const avgProbability = totalClients > 0 ? Math.round(clients.reduce((sum, c) => sum + c.probability, 0) / totalClients) : 0;
    const todayMeetingsCount = clients.filter(c => c.meeting && c.meeting.date === getTodayStr()).length;
    const aiFollowupsCount = clients.filter(c => getDealHealth(c) < 40).length;

    const funnelStages = ['Enquiry', 'New', 'Qualified', 'Proposal', 'Negotiation', 'Meeting Accepted'];
    const stageSnapshot = funnelStages.map(label => {
      const count = clients.filter(c => c.stage === label).length;
      const percent = totalClients > 0 ? Math.round((count / totalClients) * 100) : 0;
      return { label, count, percent };
    });

    const propertyTypes = ['Residential', 'Commercial', 'Luxury'];
    const propertyMix = propertyTypes.map(label => {
      const count = clients.filter(c => c.property === label).length;
      const percent = totalClients > 0 ? Math.round((count / totalClients) * 100) : 0;
      return { label, count, percent };
    });

    const leadSourceKeys = Array.from(new Set(clients.map(c => c.source)));
    const leadSourcePerformance = leadSourceKeys.map(label => {
      const count = clients.filter(c => c.source === label).length;
      return { label, count };
    });

    const agentPerformance = Array.from(new Set(clients.map(c => c.agent))).map(agent => {
      const agentClients = clients.filter(c => c.agent === agent);
      const converted = agentClients.filter(c => ['Proposal', 'Negotiation', 'Meeting Accepted'].includes(c.stage)).length;
      const conversion = agentClients.length > 0 ? ((converted / agentClients.length) * 100).toFixed(1) : '0.0';
      return {
        name: agent,
        conversion,
        total: agentClients.length,
      };
    }).sort((a, b) => Number(b.conversion) - Number(a.conversion));

    const healthyCount = clients.filter(c => getDealHealth(c) >= 70).length;
    const moderateCount = clients.filter(c => getDealHealth(c) >= 40 && getDealHealth(c) < 70).length;
    const atRiskCount = clients.filter(c => getDealHealth(c) < 40).length;

    const healthDistribution = [
      { label: 'Healthy (70+)', count: healthyCount, color: 'bg-green-500' },
      { label: 'Moderate (40-70)', count: moderateCount, color: 'bg-yellow-500' },
      { label: 'At Risk (<40)', count: atRiskCount, color: 'bg-red-500' },
    ];

    return (
      <div className="space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">Live insights from current CRM data</p>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div>AI Follow-ups: <span className="font-semibold text-red-600">{aiFollowupsCount}</span></div>
            <div>{formatDateDisplay(currentDate)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-600 uppercase">Total Clients</div>
            <div className="text-2xl font-bold mt-1">{totalClients}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-600 uppercase">Pipeline Value</div>
            <div className="text-2xl font-bold mt-1">₹{totalPipelineValue}L</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-600 uppercase">Avg Probability</div>
            <div className="text-2xl font-bold mt-1">{avgProbability}%</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-600 uppercase">Meetings Today</div>
            <div className="text-2xl font-bold mt-1">{todayMeetingsCount}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="rounded-2xl p-5 border border-gray-200 bg-white">
            <h3 className="font-semibold mb-4">Deal Stage Funnel</h3>
            <div className="space-y-3">
              {stageSnapshot.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-gray-200 bg-white">
            <h3 className="font-semibold mb-4">Property Mix</h3>
            <div className="space-y-3">
              {propertyMix.map(item => (
                <div key={item.label} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-sm">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-700">{item.count} ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Lead Source Performance</h3>
              <a href="#" className="text-xs text-yellow-500 font-medium hover:underline">Full report →</a>
            </div>
            <div className="space-y-3">
              {leadSourcePerformance.map(item => (
                <div key={item.label} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-sm">{item.label}</span>
                  <span className="text-sm font-semibold">{item.count} leads</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="rounded-2xl p-5 border border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Agent Performance</h3>
              <a href="#" className="text-xs text-yellow-500 font-medium hover:underline">Leaderboard →</a>
            </div>
            <div className="space-y-2">
              {agentPerformance.map(agent => (
                <div key={agent.name} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{agent.name}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{agent.conversion}% conversion</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-gray-200 bg-white">
            <h3 className="font-semibold mb-4">Deal Health Distribution</h3>
            <div className="space-y-3">
              {healthDistribution.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{item.label}</span>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${totalClients > 0 ? (item.count / totalClients) * 100 : 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // DataHubSection moved to its own function below
  // DataHubSection as a function component
  function DataHubSection() {
    const [uploadedFiles, setUploadedFiles] = useState([
      { name: 'march_client_dump.csv', info: '247 records · Uploaded 2 mins ago' },
      { name: 'leads_referral_batch.xlsx', info: '89 records · Uploaded today' },
      { name: 'old_pipeline_export.csv', info: '431 records · Uploaded yesterday' },
    ]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleFileChange = async (e) => {
      setUploadError('');
      const file = e.target.files[0];
      if (!file) return;
      const allowed = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ];
      if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|xlsx|xls|csv)$/i)) {
        setUploadError('Only PDF, XLSX, XLS, or CSV files are allowed.');
        return;
      }
      setUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setUploadedFiles(prev => [
          { name: file.name, info: `Uploaded just now` },
          ...prev.slice(0, 4)
        ]);
        setUploading(false);
      }, 1200);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const fakeEvent = { target: { files: e.dataTransfer.files } };
        handleFileChange(fakeEvent);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    return (
      <div className="space-y-5">
        <h2 className="text-2xl font-bold mb-5">Data Hub</h2>

        <div className="rounded-2xl p-5 border border-gray-200 bg-white">
          <h3 className="font-semibold mb-4">Upload Existing Client Files</h3>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-yellow-400 transition cursor-pointer relative"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-upload-input').click()}
            style={{ minHeight: 120 }}
          >
            <input
              id="file-upload-input"
              type="file"
              accept=".pdf,.xlsx,.xls,.csv,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
            <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 block"></i>
            <p className="text-gray-600">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Supports PDF, Excel, CSV</p>
            {uploading && <div className="mt-2 text-xs text-blue-500">Uploading...</div>}
            {uploadError && <div className="mt-2 text-xs text-red-500">{uploadError}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="rounded-2xl p-5 border border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <FiDatabase className="text-blue-600 text-lg" />
              <h3 className="font-semibold">Recently Uploaded</h3>
            </div>
            <div className="space-y-3">
              {uploadedFiles.map((file, idx) => (
                <div key={file.name + idx} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{file.info}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <FiCpu className="text-purple-600 text-lg" />
              <h3 className="font-semibold">AI Mapping Preview</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">AI automatically maps fields when you upload.</p>

            <div className="space-y-2 text-sm mb-5">
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200">✅ Customer Name → <span className="font-medium">clientName</span></div>
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200">✅ Email Address → <span className="font-medium">primaryEmail</span></div>
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200">✅ Phone → <span className="font-medium">contactPhone</span></div>
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200">✅ Investment → <span className="font-medium">dealValue</span></div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="text-sm font-semibold">247 records ready to import</div>
              <button className="px-4 py-2 rounded-lg bg-yellow-400 text-black text-sm font-medium hover:bg-yellow-500 transition">
                Process Import
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const IntegrationsSection = () => (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold mb-5">Integrations</h2>
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 border border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <i className="fab fa-whatsapp text-3xl text-green-500"></i>
            <h3 className="text-lg font-semibold">WhatsApp</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Connect your WhatsApp Business account to receive messages directly.</p>
          <div className="flex items-center gap-2 mb-3">
            <input type="text" placeholder="+91 98765 43210" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Connected</button>
          </div>
          <p className="text-xs text-gray-600">Status: <span className="text-green-600 font-medium">Active</span></p>
        </div>

        <div className="rounded-2xl p-5 border border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-envelope text-3xl text-blue-500"></i>
            <h3 className="text-lg font-semibold">Email</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Integrate your professional email to sync client conversations.</p>
          <div className="flex items-center gap-2 mb-3">
            <input type="email" placeholder="partner@vatika.com" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Connected</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'pipeline':
        return <PipelineSection />;
      case 'clients':
        return <ClientsList />;
      case 'inbox':
        return <InboxSection />;
      case 'meetings':
        return <MeetingsSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'datahub':
        return <DataHubSection />;
      case 'integrations':
        return <IntegrationsSection />;
      default:
        return <Overview />;
    }
  };

  const appThemeClass = currentTheme === 'dark'
    ? 'bg-gray-900'
    : currentTheme === 'blue'
      ? 'bg-blue-50'
      : currentTheme === 'green'
        ? 'bg-emerald-50'
        : 'bg-gray-50';

  const contentThemeClass = currentTheme === 'dark' ? 'bg-gray-900 text-gray-200' : '';
  const footerThemeClass = currentTheme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200';

  return (
    <div className={`flex h-screen font-inter ${appThemeClass}`}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} setModalOpen={setModalOpen} profileData={profileData} currentTheme={currentTheme} leftDualTheme={leftDualTheme} />

      <div className={`flex-1 flex flex-col overflow-hidden bg-linear-to-r ${rightDualTheme}`}>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} clients={clients} setModalOpen={setModalOpen} currentDate={currentDate} currentTheme={currentTheme} />

        <div className={`flex-1 overflow-y-auto p-6 ${contentThemeClass}`}>
          {renderSection()}
          <div className={`text-center py-4 text-xs mt-8 border-t ${footerThemeClass}`}>
            Powered by BURG · {new Date().getFullYear()}
          </div>
        </div>
      </div>

      <SettingsModal modalOpen={modalOpen} setModalOpen={setModalOpen} settingsPanel={settingsPanel} setSettingsPanel={setSettingsPanel} profileData={profileData} setProfileData={setProfileData} currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} leftDualTheme={leftDualTheme} setLeftDualTheme={setLeftDualTheme} rightDualTheme={rightDualTheme} setRightDualTheme={setRightDualTheme} onExportCsv={handleExportCsv} onExportExcel={handleExportExcel} />
      <ChatModal key={selectedChatClient ? selectedChatClient.id : 'no-client'} client={selectedChatClient} isOpen={chatOpen} onClose={() => setChatOpen(false)} chatInput={chatInput} setChatInput={setChatInput} setMeetingPrepClient={setMeetingPrepClient} setMeetingPrepOpen={setMeetingPrepOpen} onAddMessage={handleAddMessage} clientMessages={selectedChatClient ? (messagesByClient[selectedChatClient.id] || []) : []} />
      <InboxModal clients={clients} isOpen={inboxOpen} onClose={() => setInboxOpen(false)} selectedClientId={selectedInboxClientId} setSelectedClientId={setSelectedInboxClientId} messagesByClient={messagesByClient} onSendMessage={handleInboxSendMessage} />
      <MeetingActionModal client={activeMeetingClient} isOpen={meetingActionOpen} onClose={() => setMeetingActionOpen(false)} onReschedule={() => { setMeetingActionOpen(false); setMeetingRescheduleOpen(true); }} onCancelMeeting={handleCancelMeeting} />
      <RescheduleModal client={activeMeetingClient} isOpen={meetingRescheduleOpen} onClose={() => setMeetingRescheduleOpen(false)} onConfirm={handleMeetingRescheduleConfirm} />
      <MeetingPrepModal client={meetingPrepClient} isOpen={meetingPrepOpen} onClose={() => setMeetingPrepOpen(false)} setMeetingPrepOpen={setMeetingPrepOpen} setInboxOpen={setInboxOpen} setSelectedInboxClientId={setSelectedInboxClientId} />
    </div>
  );
};

export default Dashboard;
