import React, { useState, useEffect, useCallback } from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import { useEvents } from '../../hooks/useEvents';
import { membersService } from '../../services/membersService';
import { groupsService } from '../../services/groupsService';
import { AttendanceFilters } from '../../components/attendance/AttendanceFilters';
import { AttendanceList } from '../../components/attendance/AttendanceList';
import type { Member } from '../../types/member';
import type { AttendanceStatus } from '../../types/attendance';
import '../../styles/components/attendance.css';

export const AttendanceByEvent = () => {
  const { loading, error, attendanceList, fetchByEvent, markAttendance, updateAttendance } = useAttendance();
  const { events, fetchEvents } = useEvents();
  
  const [selectedEventId, setSelectedEventId] = useState<number>();
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  useEffect(() => {
    fetchEvents({ pageSize: 100 });
  }, [fetchEvents]);

  const loadMembers = useCallback(async (eventId: number) => {
    if (events.length === 0) return;
    
    setLoadingMembers(true);
    try {
      const event = events.find(e => e.id === eventId);
      if (event?.groupId) {
        const groupMembers = await groupsService.getMembers(event.groupId);
        setMembers(groupMembers);
      } else {
        const response = await membersService.getMembers({ pageSize: 1000 });
        setMembers(response.data);
      }
    } catch (err) {
      console.error('Error cargando miembros:', err);
    } finally {
      setLoadingMembers(false);
    }
  }, [events]);

  const refreshData = useCallback(() => { 
    if (selectedEventId) {
      fetchByEvent(selectedEventId);
      loadMembers(selectedEventId);
    }
  }, [selectedEventId, fetchByEvent, loadMembers]);

  useEffect(() => {
    if (selectedEventId && events.length > 0) {
      fetchByEvent(selectedEventId);
      loadMembers(selectedEventId);
    }
  }, [selectedEventId, fetchByEvent, loadMembers, events.length]);

  const handleMark = async (memberId: number, status: AttendanceStatus) => {
    if (!selectedEventId) return;

    const existing = attendanceList.find(a => a.memberId === memberId);
    try {
      if (existing) {
        await updateAttendance(existing.id, { memberId, eventId: selectedEventId, status });
      } else {
        await markAttendance({ memberId, eventId: selectedEventId, status });
      }
    } catch (err) {
      console.error('Error al registrar:', err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="header-icon attendance">
            <span className="material-symbols-outlined">how_to_reg</span>
          </div>
          <div>
            <h1>Registro de Asistencia</h1>
            <p>Captura la participación de los miembros en eventos activos.</p>
          </div>
        </div>
      </div>

      <AttendanceFilters 
        events={events} 
        selectedEventId={selectedEventId} 
        onEventChange={setSelectedEventId} 
        loading={loading}
      />

      {error && (
        <div className="error-banner animate-fadeIn">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      )}

      {selectedEventId ? (
        <AttendanceList 
          members={members} 
          attendanceRecords={attendanceList} 
          onMark={handleMark} 
          loading={loading || loadingMembers}
        />
      ) : (
        <div className="selection-prompt card animate-fadeIn">
          <span className="material-symbols-outlined">touch_app</span>
          <h3>Selecciona un evento para comenzar</h3>
          <p>Debes elegir un evento del listado superior para gestionar su asistencia.</p>
        </div>
      )}
    </div>
  );
};
