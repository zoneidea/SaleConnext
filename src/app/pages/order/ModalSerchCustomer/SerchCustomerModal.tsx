import React from "react";
import Modal from "react-bootstrap/Modal";
import axios from 'axios';
import { ChangeEvent, useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../modules/auth/core/Auth';

import { EntriesDropdown, PaginationTable } from '../../../modules/entriesAndPagination/Pagination'
import { Commet, ThreeDot } from 'react-loading-indicators'

//useStore
import { useCustomerStore } from '../store/SerchCustomerStore'

type MyModalProps = {
  show: boolean;
  handleClose: () => void;
};

const SerchCustomerModal: React.FC<MyModalProps> = ({ show, handleClose }) => {
  const { auth } = useAuth();

  // เก็บ item ที่เลือกลง store เพื่อนำไปใช้ใน OrderCreateBooking
  const setSelectedCustomer = useCustomerStore((state) => state.setSelectedCustomer)

  const API_THIENSURAT = import.meta.env.VITE_APP_API_THIENSURAT
  const SEARCHTYPE_URL = `${API_THIENSURAT}/SearchCustomer`;

  const [responseSearchData, setResponseSearchData] = useState<any[]>([]);
  console.log(`responseSearchData`, responseSearchData);
  const [dataType, setDataType] = useState<string>('');
  const [dataSearchInput, setDataSearchInput] = useState<string>('');

  // แสดง Show entries
  const [entries, setEntries] = useState<number>(10); // ค่าเริ่มต้นของจำนวนรายการ

  // แสดง Pagination
  const [currentPage, setCurrentPage] = useState<number>(1); // หน้าปัจจุบัน

  // คำนวณข้อมูลที่แสดงในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * entries;
  const displayedData = responseSearchData.slice(startIndex, startIndex + entries);

  const [isLoading, setIsLoading] = useState<boolean>(false); // สถานะการโหลด

  // POST SearchCustomer
  const clickSearchButton = async () => {
    setIsLoading(true); // เริ่มสถานะการโหลด
    setTimeout(async () => {
      try {
        const response = await axios.post(
          SEARCHTYPE_URL,
          {
            DataType: dataType,
            DataSearch: dataSearchInput,
            EmpId: auth.data[0].EmpId,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setResponseSearchData(data);
        setCurrentPage(1); // รีเซ็ตไปหน้าที่ 1 หลังจากค้นหาใหม่
      } catch (error) {
        console.error("Error fetching SEARCHTYPE_URL:", error);
      } finally {
        setIsLoading(false); // ปิดสถานะการโหลดหลังจากเสร็จสิ้น
      }
    }, 1000); // หน่วงเวลา 1 วินาทีก่อนเรียก API
  };

  // บันทึกข้อมูลลูกค้าที่เลือกลง Store
  const handleUseDataClick = (customer: any) => {
    setSelectedCustomer(customer);
    handleClose(); // ปิด Modal
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-xl"
      backdrop="static" // Prevent closing by clicking outside
      keyboard={false} // Prevent closing with the Esc key
    >
      <Modal.Header closeButton>
        <Modal.Title>ค้นหาลูกค้า</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <select
              className="form-select"
              style={{
                height: "38px",
                flex: 1,
                minWidth: "150px",
              }}
              onChange={(e) => setDataType(e.target.value)}
            >
              <option value="">เลือกการค้นหา...</option>
              <option value="Phonenumber">เบอร์โทร</option>
              <option value="Contract">เลขที่สัญญา</option>
              <option value="Customer">ชื่อ-นามสกุล</option>
            </select>

            <input
              type="text"
              className="form-control mx-lg-3 mx-1"
              placeholder="ข้อมูลที่ต้องการค้นหา"
              style={{
                height: "38px",
                flex: 5,
                minWidth: "200px",
              }}
              value={dataSearchInput}
              onChange={(e) => setDataSearchInput(e.target.value)}
            />

            <button
              className="btn btn-primary mt-lg-0 mt-2"
              type="button"
              style={{
                height: "38px",
                padding: "0 16px",
                whiteSpace: "nowrap",
                flex: 1,
              }}
              onClick={clickSearchButton}
            >
              ค้นหา
            </button>
          </div>

          {/* Progress Loader */}
          {isLoading && (
            <div className="text-center my-10">
              <ThreeDot />
              <p className="my-10">กำลังค้นหา โปรดรอสักครู่...</p>
            </div>
          )}

          {!isLoading && responseSearchData.length > 0 && (
            <>
              {/* Dropdown สำหรับเลือกจำนวนรายการ */}
              <EntriesDropdown onEntriesChange={(value) => setEntries(value)} />

              {/* Start Table */}
              <table className="table table-rounded table-row-bordered border table-striped gs-7 mt-3">
                <thead>
                  <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                    <th>#</th>
                    <th>เลขที่สัญญา</th>
                    <th>ชื่อลูกค้า</th>
                    <th>ที่อยู่</th>
                    <th>เบอร์โทร</th>
                    <th>Serial Number</th>
                    <th>ข้อมูล</th>
                    <th>ใช้ข้อมูล</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(displayedData) && displayedData.length > 0 ? (
                    displayedData.map((customer: any, index: number) => (
                      <tr key={index}>
                        <td>{startIndex + index + 1}</td>
                        <td>{customer.code}</td>
                        <td>{customer.name}</td>
                        <td>{customer.addr_detail}</td>
                        <td>{customer.phone_number}</td>
                        <td className={customer.serial_number ? "" : "text-center"}>{customer.serial_number || "-"}</td>
                        <td>{customer.from_data}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUseDataClick(customer)}
                          >
                            ใช้
                          </button>
                        </td>
                      </tr>
                    ))) :
                    ("")}
                </tbody>
              </table>
              {/* End Table */}

              {/* Pagination */}
              <PaginationTable
                totalData={responseSearchData.length}
                entries={entries}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </Modal.Body>

      {/* <Modal.Footer>
        <button
          className="btn btn-secondary w-100 w-md-auto align-self-center"
          onClick={handleClose}
        >
          Close
        </button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default SerchCustomerModal;