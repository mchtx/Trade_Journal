import { Routes as RouterRoutes, Route, Navigate, Outlet } from 'react-router-dom'
import Layout from '@components/Layout'
import Dashboard from '@features/dashboard/Dashboard'
import TradesList from '@features/trades/TradesList'
import AddTrade from '@features/trades/AddTrade'
import EditTrade from '@features/trades/EditTrade'
import Analytics from '@features/analytics/Analytics'
import DailyJournal from '@features/daily-journal/DailyJournal'
import Rules from '@features/rules/Rules'
import Settings from '@features/settings/Settings'
import ExtraCalculator from '@features/extra-calculator/ExtraCalculator'
import Login from '@features/auth/Login'
import Signup from '@features/auth/Signup'
import { useAuth } from './context/AuthContext'
import { Center, Spinner } from '@chakra-ui/react'

function PrivateRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return session ? <Outlet /> : <Navigate to="/login" />;
}

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trades" element={<TradesList />} />
          <Route path="/trades/new" element={<AddTrade />} />
          <Route path="/trades/:id/edit" element={<EditTrade />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/daily-journal" element={<DailyJournal />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/calculator" element={<ExtraCalculator />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </RouterRoutes>
  )
}
