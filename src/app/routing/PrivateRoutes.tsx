import React, { lazy, FC, Suspense, useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import { Commet } from 'react-loading-indicators'

import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { SalesWrapper } from '../pages/sales/SalesWrapper'
import { OrderWrapper } from '../pages/order/OrderWrapper'
import { FirstBillWrapper } from '../pages/firstBill/FirstBillWrapper'

import ErrorBoundary from '../pages/sales/components/accessCam/ErrorBoundary'

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <TopBarProgress />
        <Commet color="#32cd32" size="large" />
      </div>
    )
  }

  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

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
  const UpdateDeviceScanBarcode = lazy(() => import('../pages/sales/components/accessCam/updateDeviceScanBarcode'))
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

  const IdCardPhotoGallery = lazy(() => import('../pages/sales/components/photo/gallery/IdCardPhotoGallery'))
  const CustomerPhotoGallery = lazy(() => import('../pages/sales/components/photo/gallery/CustomerPhotoGallery'))
  const DrawingMapPhotoGallery = lazy(() => import('../pages/sales/components/photo/gallery/DrawingMapPhotoGallery'))
  const EquipmentPhotoGallery = lazy(() => import('../pages/sales/components/photo/gallery/EquipmentPhotoGallery'))
  const HomeCustomerPhotoGallery = lazy(() => import('../pages/sales/components/photo/gallery/HomeCustomerPhotoGallery'))
  const InstallationPhotoGallery = lazy(() => import('../pages/sales/components/photo/gallery/InstallationPhotoGallery'))
  const TurnPhotoGallery = lazy(() => import('../pages/sales/components/photo/gallery/TurnPhotoGallery'))

  //หัวข้อ สินค้าในสต๊อก
  const ProductStock = lazy(() => import('../pages/productstock/ProductStock'))

  //หัวข้อ ระบบตรวจสัญญา
  const ContractChecker = lazy(() => import('../pages/contractChecker/ContractChecker'))
  const ContractDetailChecker = lazy(() => import('../pages/contractChecker/ContractDetailChecker'))

  // Update contract
  const UpdateContractPackage = lazy(() => import('../pages/sales/update/UpdateSalesPackage'))
  const UpdateSalesSatusCust = lazy(() => import('../pages/sales/update/UpdateSalesSatusCust/UpdateSalesSatusCust'))
  const UpdateContractDiscount = lazy(() => import('../pages/sales/update/UpdateSaleDiscount'))
  const UpdateContractCustDetail = lazy(() => import('../pages/sales/update/UpdateSaleCustDetail'))
  const UpdateSaleAddress = lazy(() => import('../pages/sales/update/UpdateSaleAddress'))
  const UpdateSalesPDPA = lazy(() => import('../pages/sales/update/UpdateSalesPDPA'))
  const UpdateSalesContract = lazy(() => import('../pages/sales/update/UpdateSalesContract'))

  //หัวข้อ ระบบจอง
  const OrderCreateBooking = lazy(() => import('../pages/order/OrderCreateBooking'))

  //หัวข้อ ระบบตรวจใบจอง Admin
  const OrderCheckerAdmin = lazy(() => import('../pages/orderChecker/admin/OrderCheckerAdmin'))
  const OrderDetailCheckerAdmin = lazy(() => import('../pages/orderChecker/admin/OrderDetailCheckerAdmin'))

  //หัวข้อ ระบบตรวจใบจอง CT
  const OrderCheckerCT = lazy(() => import('../pages/orderChecker/ct/OrderCheckerCT'))
  const OrderDetailCheckerCT = lazy(() => import('../pages/orderChecker/ct/OrderDetailCheckerCT'))

  //หัวข้อ ระบบเก็บเงินงวดแรก
  const CreateFirstBill = lazy(() => import('../pages/firstBill/CreateFirstBill'))

  // โครงสร้างพนักงาน
  const EmpStructure = lazy(() => import('../pages/employee/EmpStructure'))

  // โครงสร้างพนักงาน
  const ReportSale = lazy(() => import('../pages/report/ReportSale'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<SuspensedView><DashboardWrapper /></SuspensedView>} />
        <Route path='sale/overview' element={<SuspensedView><SalesWrapper /></SuspensedView>} />
        <Route path='order/overview' element={<SuspensedView><OrderWrapper /></SuspensedView>} />


        {/* Start ระบบขาย */}
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
              <ErrorBoundary>
                <DeviceScanBarcode />
              </ErrorBoundary>
            </SuspensedView>
          }
        />
        <Route
          path='sale/update/updateDeviceScanBarcode'
          element={
            <SuspensedView>
              <ErrorBoundary>
                <UpdateDeviceScanBarcode />
              </ErrorBoundary>
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
          path='sale/photo/gallery/idcard'
          element={
            <SuspensedView>
              <IdCardPhotoGallery />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/gallery/customer'
          element={
            <SuspensedView>
              <CustomerPhotoGallery />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/gallery/customerHome'
          element={
            <SuspensedView>
              <HomeCustomerPhotoGallery />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/gallery/drawingMap'
          element={
            <SuspensedView>
              <DrawingMapPhotoGallery />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/gallery/equipment'
          element={
            <SuspensedView>
              <EquipmentPhotoGallery />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/gallery/installation'
          element={
            <SuspensedView>
              <InstallationPhotoGallery />
            </SuspensedView>
          }
        />
        <Route
          path='sale/photo/gallery/turn'
          element={
            <SuspensedView>
              <TurnPhotoGallery />
            </SuspensedView>
          }
        />
        {/* End ระบบขาย */}

        {/* Start ระบบตรวจสัญญา */}
        <Route
          path='contract-checker'
          element={
            <SuspensedView>
              <ContractChecker />
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
        {/* End ระบบตรวจสัญญา */}

        {/* Start อัพเดท ระบบขาย */}
        <Route
          path='sale/update/updateSalePackage'
          element={
            <SuspensedView>
              <UpdateContractPackage />
            </SuspensedView>
          }
        />
         <Route
          path='sale/update/UpdateSalesSatusCust'
          element={
            <SuspensedView>
              <UpdateSalesSatusCust />
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
        <Route
          path='sale/update/UpdateSalesPDPA'
          element={
            <SuspensedView>
              <UpdateSalesPDPA />
            </SuspensedView>
          }
        />
        <Route
          path='sale/update/UpdateSalesContract'
          element={
            <SuspensedView>
              <UpdateSalesContract />
            </SuspensedView>
          }
        />
        {/* End อัพเดท ระบบขาย */}

        {/* Start ระบบจอง */}
        <Route
          path='order/OrderCreateBooking'
          element={
            <SuspensedView>
              <OrderCreateBooking />
            </SuspensedView>
          }
        />
        {/* End ระบบจอง */}

        {/* Start ระบบตรวจใบจอง Admin */}
        <Route
          path='order-admin'
          element={
            <SuspensedView>
              <OrderCheckerAdmin />
            </SuspensedView>
          }
        />
        <Route
          path='order-admin/detailCheckerAdmin'
          element={
            <SuspensedView>
              <OrderDetailCheckerAdmin />
            </SuspensedView>
          }
        />

        {/* Start ระบบตรวจใบจอง CT */}
        <Route
          path='order-checker'
          element={
            <SuspensedView>
              <OrderCheckerCT />
            </SuspensedView>
          }
        />
        <Route
          path='order-checker/detailCheckerCT'
          element={
            <SuspensedView>
              <OrderDetailCheckerCT />
            </SuspensedView>
          }
        />
        {/* End ระบบจอง */}

        {/* Start ระบบเก็บเงินงวดแรก */}
        <Route
          path='firstBill/overview'
          element={
            <SuspensedView>
              <FirstBillWrapper />
            </SuspensedView>
          }
        />
        <Route
          path='firstBill/CreateFirstBill'
          element={
            <SuspensedView>
              <CreateFirstBill />
            </SuspensedView>
          }
        />
        {/* End ระบบเก็บเงินงวดแรก */}

        {/* Start โครงสร้างพนักงาน */}
        <Route
          path='employee/EmpStructure'
          element={
            <SuspensedView>
              <EmpStructure />
            </SuspensedView>
          }
        />
        {/* End โครงสร้างพนักงาน */}

        {/* Start รายงานระบบขาย */}
        <Route
          path='report/sale'
          element={
            <SuspensedView>
              <ReportSale />
            </SuspensedView>
          }
        />
        {/* End รายงานระบบขาย */}

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

export { PrivateRoutes }
