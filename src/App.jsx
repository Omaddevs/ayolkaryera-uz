import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import InfoPage from './pages/InfoPage.jsx'
import MessagesPage from './pages/MessagesPage.jsx'
import JobDetailPage from './pages/JobDetailPage.jsx'
import CompanyDetailPage from './pages/CompanyDetailPage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import JobsPage from './pages/JobsPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import ReelsPage from './pages/ReelsPage.jsx'
import { jobs } from './data/jobs.js'
import MapPageSkeleton from './components/JobsMap/MapPageSkeleton.jsx'
import { loadJobsMapPage } from './pages/jobsMapLoader.js'

// Leaflet faqat xarita sahifasi ochilganda yuklanadi
const JobsMapPage = lazy(loadJobsMapPage)

const demoJobId = jobs.find((j) => j.companyId === 'korzinka')?.id ?? 1

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ish/:jobId" element={<JobDetailPage />} />
          <Route path="/ishlar" element={<JobsPage />} />
          <Route path="/bildirishnomalar" element={<NotificationsPage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/ish" element={<Navigate to={`/ish/${demoJobId}`} replace />} />
          <Route path="/kompaniya/:companyId" element={<CompanyDetailPage />} />
          <Route path="/kompaniyalar" element={<Navigate to="/kompaniya/korzinka" replace />} />
          <Route path="/kategoriyalar" element={<CategoriesPage />} />
          <Route path="/kategoriya/:categoryId" element={<CategoryPage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/saqlanganlar" element={<SavedPage />} />
          <Route path="/xabarlar" element={<MessagesPage />} />
          <Route
            path="/xarita"
            element={
              <Suspense fallback={<MapPageSkeleton />}>
                <JobsMapPage />
              </Suspense>
            }
          />
          <Route path="/sahifa/:slug" element={<InfoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}
