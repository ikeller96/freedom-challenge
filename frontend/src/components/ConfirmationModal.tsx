import React from "react";
import { Button } from "./catalyst/button";

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
                <p className="text-gray-800 mb-4">{message}</p>
                <div className="flex justify-end gap-2">
                    <Button onClick={onCancel} color="zinc">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} color="red">
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;