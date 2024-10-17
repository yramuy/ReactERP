import { Button, Modal } from "react-bootstrap";

const DeleteModal = ({ deleteShow, deleteClose, handleDeleteModal }) => {
    return (
        <Modal show={deleteShow} onHide={deleteClose}>
            <Modal.Header>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this item?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={deleteClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDeleteModal}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;