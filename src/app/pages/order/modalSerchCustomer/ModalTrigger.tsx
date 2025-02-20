import React from "react";

type ModalTriggerProps = {
    handleShow: () => void;
};

const ModalTrigger: React.FC<ModalTriggerProps> = ({ handleShow }) => {
    return (
        <button
            className='btn btn-success w-100 w-md-auto align-self-center h-50px mt-5'
            onClick={handleShow}
        >
            ค้นหาลูกค้า
        </button>
    );
};

export default ModalTrigger;