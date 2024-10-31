import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'

import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { SalesWrapper } from '../pages/sales/SalesWrapper'

const PrivateRoutes = () => {
  //หัวข้อ ระบบขาย
  const SalesSatusCust = lazy(() => import('../pages/sales/SalesSatusCust'))
  const SalesProduct = lazy(() => import('../pages/sales/SalesProduct'))
  const SalesCreateCust = lazy(() => import('../pages/sales/SalesCreateCust'))
  const SalesWaterMeas = lazy(() => import('../pages/sales/SalesWaterMeas'))
  const SalesContract = lazy(() => import('../pages/sales/SalesContract'))
  const SalesReceipt = lazy(() => import('../pages/sales/SalesReceipt'))
  const SalesAddCustInfo = lazy(() => import('../pages/sales/SalesAddCustInfo'))
  const Step = lazy(() => import('../pages/sales/components/step/Step'))
  const SalesDiscount = lazy(() => import('../pages/sales/SalesDiscount'))
  const SalesPackage = lazy(() => import('../pages/sales/SalesPackage'))
  const SalesPDPA = lazy(() => import('../pages/sales/SalesPDPA'))

  //กล้อง + รูป
  const DeviceScanBarcode = lazy(() => import('../pages/sales/components/accessCam/DeviceScanBarcode'))
  const SalesPhoto = lazy(() => import('../pages/sales/SalesPhoto'))
  const IdCardPhoto = lazy(() => import('../pages/sales/components/photo/IdCardPhoto'))
  const GalleryGoogleMapGPS = lazy(() => import('../pages/sales/components/photo/gps/GalleryGoogleMapGPS'))
  const GoogleMapGPS = lazy(() => import('../pages/sales/components/photo/gps/GoogleMapGPS'))
  const DrawingMapPhoto = lazy(() => import('../pages/sales/components/photo/DrawingMapPhoto'))
  const TurnPhoto = lazy(() => import('../pages/sales/components/photo/TurnPhoto'))
  const InstallationPhoto = lazy(() => import('../pages/sales/components/photo/InstallationPhoto'))
  const HomeCustomerPhoto = lazy(() => import('../pages/sales/components/photo/HomeCustomerPhoto'))
  const CustomerPhoto = lazy(() => import('../pages/sales/components/photo/CustomerPhoto'))
  const EquipmentPhoto = lazy(() => import('../pages/sales/components/photo/EquipmentPhoto'))

  //หัวข้อ สินค้าในสต๊อก
  const ProductStock = lazy(() => import('../pages/productstock/ProductStock'))

  //หัวข้อ ระบบตรวจสัญญา
  const ContractChecker = lazy(() => import('../pages/contractChecker/ContractChecker'))
  const ContractCheckerStep = lazy(() => import('../pages/contractChecker/step/Step'))
  const ContractDetailChecker = lazy(() => import('../pages/contractChecker/ContractDetailChecker'))

  // Update contract
  const UpdateContractPackage = lazy(() => import('../pages/sales/update/UpdateSalesPackage'))
  const UpdateContractDiscount = lazy(() => import('../pages/sales/update/UpdateSaleDiscount'))
  const UpdateContractCustDetail = lazy(() => import('../pages/sales/update/UpdateSaleCustDetail'))
  const UpdateSaleAddress = lazy(() => import('../pages/sales/update/UpdateSaleAddress'))

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
          path='sale/contract'
          element={
            <SuspensedView>
              <SalesContract />
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
        <Route
          path='productstock'
          element={
            <SuspensedView>
              <ProductStock />
            </SuspensedView>
          }
        />
        <Route
          path='sale/pdpa'
          element={
            <SuspensedView>
              <SalesPDPA />
            </SuspensedView>
          }
        />
        {/* เริ่ม รูปและแกลอรี่ */}
        <Route
          path='sale/photo'
          element={
            <SuspensedView>
              <SalesPhoto />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/idcard'
          element={
            <SuspensedView>
              <IdCardPhoto />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/gallery-gps'
          element={
            <SuspensedView>
              <GalleryGoogleMapGPS />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/gps'
          element={
            <SuspensedView>
              <GoogleMapGPS />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/drawing-map'
          element={
            <SuspensedView>
              <DrawingMapPhoto />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/turn'
          element={
            <SuspensedView>
              <TurnPhoto />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/installation'
          element={
            <SuspensedView>
              <InstallationPhoto />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/home-customer'
          element={
            <SuspensedView>
              <HomeCustomerPhoto />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/customer'
          element={
            <SuspensedView>
              <CustomerPhoto />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/equipment'
          element={
            <SuspensedView>
              <EquipmentPhoto />
            </SuspensedView>
          }
        />
        <Route
          path='contract-checker'
          element={
            <SuspensedView>
              <ContractChecker />
            </SuspensedView>
          }
        />
        <Route
          path='contract-checker/step'
          element={
            <SuspensedView>
              <ContractCheckerStep />
            </SuspensedView>
          }
        />
        <Route
          path='contract-checker/detailChecker'
          element={
            <SuspensedView>
              <ContractDetailChecker />
            </SuspensedView>
          }
        />

        {/* Update contract route  */}
        <Route
          path='sale/update/updateSalePackage'
          element={
            <SuspensedView>
              <UpdateContractPackage />
            </SuspensedView>
          }
        />
        <Route
          path='sale/update/updateSaleDiscount'
          element={
            <SuspensedView>
              <UpdateContractDiscount />
            </SuspensedView>
          }
        />

        <Route
          path='sale/update/updateCustDetail'
          element={
            <SuspensedView>
              <UpdateContractCustDetail />
            </SuspensedView>
          }
        />

        <Route
          path='sale/update/updateAddress'
          element={
            <SuspensedView>
              <UpdateSaleAddress />
            </SuspensedView>
          }
        />

        {/* จบ รูปและแกลอรี่ */}
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
