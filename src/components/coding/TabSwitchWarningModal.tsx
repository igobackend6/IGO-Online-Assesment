import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface TabSwitchWarningModalProps {
  isOpen: boolean
  onContinue: () => void
}

export function TabSwitchWarningModal({ isOpen, onContinue }: TabSwitchWarningModalProps) {
  return (
    <Modal isOpen={isOpen} title="Warning!" onClose={onContinue}>
      <p>You switched tabs. One more switch will automatically submit your assessment.</p>
      <div className="mt-5 flex justify-end">
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </Modal>
  )
}
