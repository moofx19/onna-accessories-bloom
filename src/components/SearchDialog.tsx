
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from 'lucide-react';
import SearchInput from './SearchInput';

interface SearchDialogProps {
  children?: React.ReactNode;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button className="text-sage-700 hover:text-sage-500">
            <Search className="h-5 w-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="p-2">
          <h2 className="text-xl font-medium text-sage-800 mb-4">Search Products</h2>
          <SearchInput onClose={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
