import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdChevronLeft, MdChevronRight, MdAccessTime, MdPerson, MdLabel } from 'react-icons/md';

const CalendarView = ({ appointments = [], onSelectDate, selectedDate }) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getAppointmentsForHour = (hour) => {
    return appointments.filter(apt => {
      const aptHour = parseInt(apt.appointment_time.split(':')[0]);
      return aptHour === hour;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    onSelectDate(newDate);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="date-nav">
          <button className="nav-btn" onClick={() => changeDate(-1)}><MdChevronLeft /></button>
          <h2 className="current-date">{formatDate(selectedDate)}</h2>
          <button className="nav-btn" onClick={() => changeDate(1)}><MdChevronRight /></button>
        </div>
        <button className="today-btn" onClick={() => onSelectDate(new Date())}>Today</button>
      </div>

      <div className="time-grid">
        {hours.map(hour => (
          <div key={hour} className="time-row">
            <div className="time-label">
              {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
            </div>
            <div className="slot-content">
              <AnimatePresence>
                {getAppointmentsForHour(hour).map((apt, idx) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`apt-block status-${apt.status}`}
                  >
                    <div className="apt-info">
                      <span className="apt-time">
                        <MdAccessTime className="mr-1" />
                        {apt.appointment_time.substring(0, 5)}
                      </span>
                      <h4 className="apt-patient">
                        <MdPerson className="mr-1" />
                        {apt.patient_name}
                      </h4>
                      <div className="apt-type">
                        <MdLabel className="mr-1" />
                        {apt.type.replace('_', ' ')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .calendar-view {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .calendar-header {
          padding: var(--space-6);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
        }
        .date-nav {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          background: transparent;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: var(--color-accent-soft);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .current-date {
          font-size: var(--fs-xl);
          font-weight: var(--fw-bold);
          color: white;
          min-width: 250px;
          text-align: center;
        }
        .today-btn {
          padding: 6px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-accent);
          background: var(--color-accent-soft);
          color: var(--color-accent);
          font-weight: bold;
          cursor: pointer;
          font-size: var(--fs-sm);
        }

        .time-grid {
          flex: 1;
          overflow-y: auto;
          max-height: 700px;
          padding: var(--space-4);
        }
        .time-row {
          display: flex;
          min-height: 80px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        .time-label {
          width: 80px;
          padding: var(--space-2);
          font-size: var(--fs-xs);
          color: var(--color-text-muted);
          text-align: right;
          font-weight: bold;
          text-transform: uppercase;
        }
        .slot-content {
          flex: 1;
          padding: var(--space-2);
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
          border-left: 1px solid rgba(255, 255, 255, 0.03);
        }

        .apt-block {
          flex: 1;
          min-width: 200px;
          max-width: 300px;
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          border-left: 4px solid transparent;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .status-scheduled { background: rgba(56, 189, 248, 0.1); border-color: #38bdf8; }
        .status-confirmed { background: rgba(168, 85, 247, 0.1); border-color: #a855f7; }
        .status-completed { background: rgba(34, 197, 94, 0.1); border-color: #22c55e; }
        
        .apt-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .apt-time {
          display: flex;
          align-items: center;
          font-size: 11px;
          font-weight: bold;
          color: var(--color-text-muted);
        }
        .apt-patient {
          display: flex;
          align-items: center;
          font-size: var(--fs-sm);
          font-weight: var(--fw-bold);
          color: white;
          margin: 0;
        }
        .apt-type {
          display: flex;
          align-items: center;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--color-text-secondary);
        }
        
        .mr-1 { margin-right: 4px; }
      `}</style>
    </div>
  );
};

export default CalendarView;
