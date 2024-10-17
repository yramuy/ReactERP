import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import Screen from "./screen";
import UserRoleScreen from "./userrolescreen";
import MenuItems from "./menuitem";

const MenuConfig = ({ show, handleClose, text }) => {

    let modal;

    if (text === 'Screen') {
        modal = <Screen />
    } else if(text === 'User Role Screen') {
        modal = <UserRoleScreen />
    } else {
        modal = <MenuItems />
    }

    let response = useSelector((state) => {
        return state.moduleData;
    });

    return (
        <>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{text}</Modal.Title>
                    <Button variant="secondary" onClick={handleClose}>
                        X
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {response['loading'] && <div class="loader"></div>}
                    <div className="row">
                        {modal}

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MenuConfig;