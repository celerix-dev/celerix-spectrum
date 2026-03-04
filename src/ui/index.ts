import { initDropdowns } from '../core/components/dropdown'
import { initModals, openModal, closeModal } from '../core/components/modal'

export const initUI = () => {
    initDropdowns();
    initModals();
};

export {
    initDropdowns,
    initModals,
    openModal,
    closeModal
}
