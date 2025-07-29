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
} from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';

// Import your CRUD functions and the Inspiration data type
import {
  addInspiration,
  getInspirations,
  updateInspiration,
  deleteInspiration,
  Inspiration,
} from '@/lib/inspirationService';

// Extend Inspiration type to include unfurl data
interface InspirationWithUnfurl extends Inspiration {
  unfurlData?: {
    title: string;
    description: string;
    imageUrl: string | null;
    url: string; // The canonical URL
  };
  unfurlLoading?: boolean;
  unfurlError?: boolean;
}

// AddInspirationForm component (keep as is or similar)
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
  const [imageUrl, setImageUrl] = useState(''); // Allow user to provide a direct image

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newInspiration: Omit<Inspiration, 'id'> = {
      title,
      notes,
      link,
      imageUrl, // Use user provided image if available
      addedBy: 'You',
    };
    await onAdd(newInspiration);
    onClose();
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
            Link (for preview)
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
            Direct Image URL (optional)
          </Label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="col-span-3"
            placeholder="e.g., from Unsplash, if no link preview"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-terracotta hover:bg-terracotta/90"
        >
          {isLoading ? 'Adding...' : 'Add Idea'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function InspirationBoard() {
  const [inspirations, setInspirations] = useState<InspirationWithUnfurl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to fetch data from Firestore and update the state
  const fetchAndSetData = async () => {
    try {
      !isLoading && setIsLoading(true);
      const data = await getInspirations();
      console.log('Fetched inspirations:', data);

      // Initialize unfurl data fields
      const initialInspirations: InspirationWithUnfurl[] = data.map((item) => ({
        ...item,
        unfurlData: undefined,
        unfurlLoading: false,
        unfurlError: false,
      }));
      setInspirations(initialInspirations);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch unfurl data for a specific item
  const fetchUnfurlData = async (index: number, link: string) => {
    setInspirations((prevInspirations) => {
      const newInspirations = [...prevInspirations];
      newInspirations[index].unfurlLoading = true;
      return newInspirations;
    });

    try {
      const response = await fetch(
        `/api/unfurl?url=${encodeURIComponent(link)}`,
      );
      const data = await response.json();

      setInspirations((prevInspirations) => {
        const newInspirations = [...prevInspirations];
        if (response.ok) {
          newInspirations[index].unfurlData = data;
          newInspirations[index].unfurlError = false;
        } else {
          console.error('Failed to unfurl link:', data.error);
          newInspirations[index].unfurlError = true;
        }
        newInspirations[index].unfurlLoading = false;
        return newInspirations;
      });
    } catch (error) {
      console.error('Network error during unfurl:', error);
      setInspirations((prevInspirations) => {
        const newInspirations = [...prevInspirations];
        newInspirations[index].unfurlError = true;
        newInspirations[index].unfurlLoading = false;
        return newInspirations;
      });
    }
  };

  // Fetch data when the component first loads
  useEffect(() => {
    fetchAndSetData();
  }, []);

  // Use another useEffect to fetch unfurl data once inspirations are loaded
  useEffect(() => {
    inspirations.forEach((item, index) => {
      if (
        item.link &&
        !item.unfurlData &&
        !item.unfurlLoading &&
        !item.unfurlError
      ) {
        fetchUnfurlData(index, item.link);
      }
    });
  }, [inspirations]); // Re-run when inspirations change

  // --- CRUD Handler Functions ---

  const handleAddItem = async (newItem: Omit<Inspiration, 'id'>) => {
    setIsAddingItem(true);
    try {
      await addInspiration(newItem);
      fetchAndSetData(); // Refetch to show the new item
    } catch (error) {
      console.error('Failed to add inspiration:', error);
    } finally {
      setIsAddingItem(false);
      setIsDialogOpen(false);
    }
  };

  const handleUpdateItem = async (id: string) => {
    const newNote = prompt('Enter a new note for this item:'); // Fix: No unescaped apostrophe here
    if (newNote) {
      await updateInspiration(id, { notes: newNote });
      fetchAndSetData();
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inspiration?')) {
      // Fix: No unescaped apostrophe here
      try {
        await deleteInspiration(id);
        fetchAndSetData();
      } catch (error) {
        console.error('Failed to delete inspiration:', error);
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
            {inspirations.map((item, index) => (
              <Card key={item.id} className="flex flex-col group">
                <div className="relative">
                  {/* Conditional rendering for image source */}
                  {item.unfurlLoading ? (
                    <div className="rounded-t-lg bg-gray-100 h-40 w-full flex items-center justify-center animate-pulse">
                      <ImageIcon className="h-12 w-12" />
                      <span className="ml-2 text-sm">Loading preview...</span>
                    </div>
                  ) : item.unfurlError ? (
                    <div className="rounded-t-lg bg-red-100 h-40 w-full flex items-center justify-center text-red-500">
                      <ImageIcon className="h-12 w-12" />
                      <span className="ml-2 text-sm">Preview Failed</span>
                    </div>
                  ) : item.unfurlData?.imageUrl ? ( // Use unfurl image first
                    <img
                      src={item.unfurlData.imageUrl}
                      alt={item.unfurlData.title || 'Link preview'}
                      className="rounded-t-lg object-cover h-40 w-full"
                    />
                  ) : item.imageUrl ? ( // Fallback to user-provided image
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="rounded-t-lg object-cover h-40 w-full"
                    />
                  ) : (
                    <div className="rounded-t-lg bg-gray-200 h-40 w-full flex items-center justify-center text-gray-500">
                      <ImageIcon className="h-16 w-16" />
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
                  {/* Display unfurled title/description or item's own */}
                  <h3 className="font-semibold text-rich-black">
                    {item.unfurlData?.title || item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 flex-grow">
                    {item.unfurlData?.description || item.notes}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-silver-mist">
                      Added by {item.addedBy}
                    </span>
                    {item.link && ( // Only show external link if a link exists
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${
                          item.unfurlData?.title || item.title
                        }`}
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4 text-terracotta" />
                        </Button>
                      </a>
                    )}
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
