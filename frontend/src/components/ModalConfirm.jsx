// frontend/src/components/ModalConfirm.jsx
import React from 'react';

function ModalConfirm({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirm;
