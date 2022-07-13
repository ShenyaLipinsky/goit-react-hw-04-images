import propTypes from 'prop-types';
import { Component } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalImg } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  static propTypes = {
    onClose: propTypes.func.isRequired,
  };
  componentDidMount() {
    window.addEventListener('keydown', this.handleModal);
    window.addEventListener('click', this.handleModal);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleModal);
    window.removeEventListener('click', this.handleModal);
  }
  handleModal = e => {
    if (e.code === 'Escape' || e.target.nodeName === 'DIV') {
      this.props.onClose();
    }
  };
  render() {
    return createPortal(
      <Overlay>
        <ModalImg>{this.props.children}</ModalImg>
      </Overlay>,
      modalRoot
    );
  }
}
