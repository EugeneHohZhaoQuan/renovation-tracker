// components/inspiration-board.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ExternalLink,
  MoreVertical,
  Trash2,
  Pencil,
  ImageIcon,
} from 'lucide-react'; // Import ImageIcon

// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Import Input and Label for the form
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have a Textarea component

// Import your CRUD functions and the Inspiration data type
import {
  addInspiration,
  getInspirations,
  updateInspiration,
  deleteInspiration,
  Inspiration,
} from '@/lib/inspirationService';

// AddInspirationForm component (can be defined in a separate file or here for simplicity)
interface AddInspirationFormProps {
  onAdd: (inspiration: Omit<Inspiration, 'id'>) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

function AddInspirationForm({
  onAdd,
  onClose,
  isLoading,
}: AddInspirationFormProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newInspiration: Omit<Inspiration, 'id'> = {
      title,
      notes,
      link,
      imageUrl,
      addedBy: 'You', // Or get from auth context later
    };
    await onAdd(newInspiration);
    onClose(); // Close dialog after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notes" className="text-right">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="link" className="text-right">
            Link
          </Label>
          <Input
            id="link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="imageUrl" className="text-right">
            Image URL
          </Label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-terracotta hover:bg-terracotta/90 text-gray-500"
        >
          {isLoading ? 'Adding...' : 'Add Idea'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function InspirationBoard() {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false); // New state for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  // Function to fetch data from Firestore and update the state
  const fetchAndSetData = async () => {
    try {
      !isLoading && setIsLoading(true); // Only set loading if not already
      const data = await getInspirations();
      console.log('Fetched inspirations:', data);
      setInspirations(data);
    } catch (error) {
      console.error(error);
      // Optionally set an error state here to show in the UI
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when the component first loads
  useEffect(() => {
    fetchAndSetData();
  }, []);

  // --- CRUD Handler Functions ---

  const handleAddItem = async (newItem: Omit<Inspiration, 'id'>) => {
    setIsAddingItem(true); // Indicate that an item is being added
    try {
      await addInspiration(newItem);
      fetchAndSetData(); // Refetch to show the new item
    } catch (error) {
      console.error('Failed to add inspiration:', error);
      // Handle error, e.g., show a toast notification
    } finally {
      setIsAddingItem(false); // Reset adding state
      setIsDialogOpen(false); // Close the dialog
    }
  };

  const handleUpdateItem = async (id: string) => {
    // In a real app, you'd open a dialog to get new values
    const newNote = prompt('Enter a new note for this item:');
    if (newNote) {
      await updateInspiration(id, { notes: newNote });
      fetchAndSetData(); // Refetch to show the change
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inspiration?')) {
      try {
        await deleteInspiration(id);
        fetchAndSetData(); // Refetch to remove the item from the UI
      } catch (error) {
        console.error('Failed to delete inspiration:', error);
        // Handle error
      }
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-dark-roast">Inspiration Board</CardTitle>
          <CardDescription>Shared ideas for our dream home.</CardDescription>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-terracotta hover:bg-terracotta/90 cursor-pointer"
        >
          Add New Idea
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-10">Loading inspirations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inspirations.map((item) => (
              <Card key={item.id} className="flex flex-col group">
                <div className="relative">
                  {item.imageUrl ? ( // Conditional rendering for image or placeholder
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="rounded-t-lg object-cover h-40 w-full"
                    />
                  ) : (
                    <div className="rounded-t-lg bg-gray-200 h-40 w-full flex items-center justify-center text-gray-500">
                      <ImageIcon className="h-16 w-16" />{' '}
                      {/* Placeholder icon */}
                    </div>
                  )}
                  {/* Actions Dropdown Menu */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-80 group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleUpdateItem(item.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-rich-black">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 flex-grow">
                    {item.notes}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-silver-mist">
                      Added by {item.addedBy}
                    </span>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4 text-terracotta" />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Inspiration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Inspiration</DialogTitle>
            <DialogDescription>
              Enter the details for your new inspiration idea.
            </DialogDescription>
          </DialogHeader>
          <AddInspirationForm
            onAdd={handleAddItem}
            onClose={() => setIsDialogOpen(false)}
            isLoading={isAddingItem}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
