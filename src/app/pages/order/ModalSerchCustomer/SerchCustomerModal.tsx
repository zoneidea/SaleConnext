import React from "react";
import Modal from "react-bootstrap/Modal";

type MyModalProps = {
  show: boolean;
  handleClose: () => void;
};

const SerchCustomerModal: React.FC<MyModalProps> = ({ show, handleClose }) => {
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
        >
          <option value="">เลือกการค้นหา...</option>
          {/* ตัวเลือกอื่น ๆ สามารถเพิ่มได้ที่นี่ */}
        </select>

        <input
          type="text"
          className="form-control"
          placeholder="ข้อมูลที่ต้องการค้นหา"
          style={{
            height: "38px",
            flex: 5, 
            minWidth: "200px",
          }}
        />

        <button
          className="btn btn-primary"
          type="button"
          style={{
            height: "38px",
            padding: "0 16px",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          ค้นหา
        </button>
      </div>
    </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          className="btn btn-secondary w-100 w-md-auto align-self-center h-50px mt-5"
          onClick={handleClose}
        >
          Close
        </button>
        <button
          className="btn btn-primary w-100 w-md-auto align-self-center h-50px mt-5"
          onClick={handleClose}
        >
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default SerchCustomerModal;