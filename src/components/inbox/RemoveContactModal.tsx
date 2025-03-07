
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveContactModalProps {
  open: boolean;
  contactName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const RemoveContactModal: React.FC<RemoveContactModalProps> = ({
  open,
  contactName,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove Contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {contactName} from your contacts? 
            This action cannot be undone and all conversations with this contact will be removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
