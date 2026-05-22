import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import CaseListScreen from './screens/CaseListScreen'
import CaseReviewScreen from './screens/CaseReviewScreen'
import DashboardStatsScreen from './screens/DashboardStatsScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/cases" replace />} />
          <Route path="cases" element={<CaseListScreen />} />
          <Route path="cases/:id/review" element={<CaseReviewScreen />} />
          <Route path="stats" element={<DashboardStatsScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
