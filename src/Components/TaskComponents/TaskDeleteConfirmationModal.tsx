import PopupModal from "../Modal"

interface TaskDeleteConfirmationModalProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

const TaskDeleteConfirmationModal: React.FC<TaskDeleteConfirmationModalProps> = ({open, onClose, onConfirm}) => {
    return (
        <PopupModal open={open} onClose={onClose} title={'Delete Task'} onConfirm={onConfirm}>
            <p>
                Are you sure you want to delete this task?
            </p>
        </PopupModal>
    )
}

export default TaskDeleteConfirmationModal