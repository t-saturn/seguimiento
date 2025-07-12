import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  numeroExpediente?: string;
}

export const ExpedienteModal = ({ isOpen, onClose, numeroExpediente }: ModalProps) => {
  // Bloquea el scroll del fondo cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center relative">
        {/* Contenido del modal */}
        {numeroExpediente ? (
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
            Número de Expediente:
            <br />
            {numeroExpediente}
          </h2>
        ) : (
          <p className="text-base text-gray-700 dark:text-gray-300">
            El documento aún no tiene expediente.
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
