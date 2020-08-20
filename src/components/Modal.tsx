import React from "react";
import { CSSTransition } from "react-transition-group";

import styles from "./Modal.module.scss";

interface ModalProps {
    children: React.ReactNode;
    show: boolean;
}
const Modal = ({ children, show }: ModalProps) => {
    return (<CSSTransition
        mountOnEnter
        unmountOnExit
        in={show}
        timeout={250}
        classNames={{
            enter: styles.modalEnter,
            enterActive: styles.modalEnterActive,
            exit: styles.modalExit,
            exitActive: styles.modalExitActive,
        }}>
        <section className={styles.modal} >{children}</section>
    </CSSTransition>)

}

export default Modal;