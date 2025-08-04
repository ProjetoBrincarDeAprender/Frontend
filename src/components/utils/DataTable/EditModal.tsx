import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Edit } from "lucide-react";
import { twMerge } from "tailwind-merge";

type EditModalProps = {
  title: string;
  titleDescription?: string;
  children: React.ReactNode;
  customTrigger?: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  descriptionClassName?: string;
  customClose?: React.ReactNode;
  closeText?: string;
};

export default function EditModal({
  customTrigger,
  customClose,
  closeText,
  title,
  titleDescription,
  triggerClassName,
  contentClassName,
  headerClassName,
  descriptionClassName,
  children,
}: EditModalProps) {
  return (
    <Dialog>
      <DialogTrigger
        asChild={customTrigger ? true : false}
        className={twMerge(
          "text-purplish-blue hover:text-yellow h-fit w-fit rounded-lg bg-green-600 px-6 py-2 shadow transition duration-300 hover:bg-green-700",
          triggerClassName,
        )}
      >
        {customTrigger ? customTrigger : <Edit />}
      </DialogTrigger>
      <DialogContent className={contentClassName}>
        <DialogHeader className={headerClassName}>
          <DialogTitle>{title}</DialogTitle>
          {titleDescription && (
            <DialogDescription className={descriptionClassName}>
              {titleDescription}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter>
          {customClose ? (
            <DialogClose asChild>{customClose}</DialogClose>
          ) : (
            <DialogClose>{closeText}</DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
