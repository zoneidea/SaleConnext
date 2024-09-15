import { FC } from 'react'
// import { KTSVG } from './KTSVG'; // สมมติว่าคุณมีไฟล์นี้

type ModalComponentProps = {
    show: boolean;
    onClose: () => void;
};

const AlertStatusCustomer: FC<ModalComponentProps> = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Modal title</h5>
                        <button
                            type="button"
                            className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            {/* <Link
                                path="media/icons/duotune/arrows/arr061.svg"
                                className="svg-icon svg-icon-2x"
                            /> */}
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Modal body text goes here.</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button type="button" className="btn btn-primary">
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { AlertStatusCustomer }
