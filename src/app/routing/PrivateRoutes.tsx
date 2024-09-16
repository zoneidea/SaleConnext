import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'

import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { SalesWrapper } from '../pages/sales/SalesWrapper'

const PrivateRoutes = () => {
  const SalesSatusCust = lazy(() => import('../pages/sales/SalesSatusCust'))
  const SalesProduct = lazy(() => import('../pages/sales/SalesProduct'))
  const SalesCreateCust = lazy(() => import('../pages/sales/SalesCreateCust'))
  const SalesWaterMeas = lazy(() => import('../pages/sales/SalesWaterMeas'))
  const SalesHirePurchaseAgmt = lazy(() => import('../pages/sales/SalesHirePurchaseAgmt'))
  const SalesReceipt = lazy(() => import('../pages/sales/SalesReceipt'))
  const SalesAddCustInfo = lazy(() => import('../pages/sales/SalesAddCustInfo'))
  const SalesPic = lazy(() => import('../pages/sales/SalesPic'))
  const SalesGallery = lazy(() => import('../pages/sales/SalesGallery'))
  const DeviceSpecificCamera = lazy(() => import('../pages/sales/components/accessCam/DeviceSpecificCamera'))
  const Step = lazy(() => import('../pages/sales/components/step/Step'))
  const DeviceScanBarcode = lazy(() => import('../pages/sales/components/accessCam/DeviceScanBarcode'))
  const SalesDiscount = lazy(() => import('../pages/sales/SalesDiscount'))
  const SalesPackage = lazy(() => import('../pages/sales/SalesPackage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='sale/overview' element={<SalesWrapper />} />
        {/* Lazy Modules */}
        <Route
          path='sale/statuscust'
          element={
            <SuspensedView>
              <SalesSatusCust />
            </SuspensedView>
          }
        />
        <Route
          path='sale/package'
          element={
            <SuspensedView>
              <SalesPackage />
            </SuspensedView>
          }
        />
        <Route
          path='sale/product'
          element={
            <SuspensedView>
              <SalesProduct />
            </SuspensedView>
          }
        />
        <Route
          path='sale/createcust'
          element={
            <SuspensedView>
              <SalesCreateCust />
            </SuspensedView>
          }
        />
        <Route
          path='sale/watermeas'
          element={
            <SuspensedView>
              <SalesWaterMeas />
            </SuspensedView>
          }
        />
        <Route
          path='sale/hirepurchaseagmt'
          element={
            <SuspensedView>
              <SalesHirePurchaseAgmt />
            </SuspensedView>
          }
        />
        <Route
          path='sale/receipt'
          element={
            <SuspensedView>
              <SalesReceipt />
            </SuspensedView>
          }
        />
        <Route
          path='sale/addcustinfo'
          element={
            <SuspensedView>
              <SalesAddCustInfo />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo'
          element={
            <SuspensedView>
              <SalesPic />
            </SuspensedView>
          }
        />
        <Route
          path='sale/gallery'
          element={
            <SuspensedView>
              <SalesGallery />
            </SuspensedView>
          }
        />
        <Route
          path='sale/camera'
          element={
            <SuspensedView>
              <DeviceSpecificCamera />
            </SuspensedView>
          }
        />
        <Route
          path='sale/step'
          element={
            <SuspensedView>
              <Step />
            </SuspensedView>
          }
        />
        <Route
          path='sale/scanbarcode'
          element={
            <SuspensedView>
              <DeviceScanBarcode />
            </SuspensedView>
          }
        />
        <Route
          path='sale/discount'
          element={
            <SuspensedView>
              <SalesDiscount />
            </SuspensedView>
          }
        />
        {/* <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        /> */}
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
