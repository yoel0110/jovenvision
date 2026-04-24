import { Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { Login, Dashboard, Members, CreateMember, EditMember, Groups, CreateGroup, EditGroup, GroupMembers, Events, CreateEvent, EditEvent, AttendanceByEvent, MemberAttendanceHistory, MemberFollowups, Unauthorized, NotFound } from '../pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/create" element={<CreateMember />} />
          <Route path="/members/edit/:id" element={<EditMember />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/edit/:id" element={<EditGroup />} />
          <Route path="/groups/:id/members" element={<GroupMembers />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/edit/:id" element={<EditEvent />} />
          <Route path="/attendance/event" element={<AttendanceByEvent />} />
          <Route path="/attendance/member" element={<MemberAttendanceHistory />} />
          <Route path="/followup/member/:memberId" element={<MemberFollowups />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
      );
};
