import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";

const StartQuizModal = ({
  open,
  onClose,
  onStart,
  title,
  totalQuestions,
}: {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
  title: string;
  totalQuestions: number;
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Start Quiz
                  </DialogTitle>
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="mb-1 font-medium">{title}</p>
                    <p className="mb-3">Total questions: <span className="font-semibold">{totalQuestions}</span></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Read each question carefully before answering.</li>
                      <li>You can navigate between questions and mark for review.</li>
                      <li>Your total time will be recorded automatically.</li>
                      <li>Submit once you have completed the quiz. You can attempt only once.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex w-full justify-center rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white cursor-pointer shadow-xs hover:bg-dark-bg sm:ml-3 sm:w-auto"
              >
                Start Quiz
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-100 sm:mt-0 sm:w-auto cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default StartQuizModal;