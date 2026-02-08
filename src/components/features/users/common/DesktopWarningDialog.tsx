import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Monitor } from "lucide-react";

interface DesktopWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopWarningDialog = ({
  isOpen,
  onClose,
}: DesktopWarningDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle size={24} />
            Aviso de Uso
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <Monitor className="mx-auto mb-4 h-16 w-16 text-gray-600" />
          <p className="mb-4 text-gray-700">
            Este projeto foi desenvolvido para ser usado em computadores
            desktop.
          </p>
          <p className="mb-6 font-medium text-orange-600">
            Acessar através de um dispositivo móvel pode resultar em uma
            experiência inadequada ou ocasionar erros.
          </p>
          <Button onClick={onClose}>Entendido, continuar mesmo assim</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
