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
import { ExternalLink, MoreVertical, Trash2, Pencil } from 'lucide-react';

// Import your CRUD functions and the Inspiration data type
import {
  addInspiration,
  getInspirations,
  updateInspiration,
  deleteInspiration,
  Inspiration,
} from '@/lib/inspirationService';

// NOTE: We will add a proper form in a Dialog later. For now, adding is a test.

export function InspirationBoard() {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch data from Firestore and update the state
  const fetchAndSetData = async () => {
    try {
      !isLoading && setIsLoading(true);
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

  const handleAddItem = async () => {
    // This data would normally come from a form in a Dialog
    const newItem = {
      title: 'New Idea from Board',
      notes: 'This was added with the button.',
      link: 'https://example.com',
      imageUrl: `https://source.unsplash.com/random/400x300?interior,${Date.now()}`, // Random image
      addedBy: 'You',
    };
    await addInspiration(newItem);
    fetchAndSetData(); // Refetch to show the new item
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
      await deleteInspiration(id);
      fetchAndSetData(); // Refetch to remove the item from the UI
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-dark-roast">Inspiration Board</CardTitle>
          <CardDescription>Shared ideas for our dream home.</CardDescription>
        </div>
        {/* The "Add Idea" button now triggers the CREATE function */}
        <Button
          onClick={handleAddItem}
          className="bg-terracotta hover:bg-terracotta/90"
        >
          Add Test Idea
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
                  <img
                    src={
                      item.imageUrl ||
                      'https://source.unsplash.com/random/400x300?architecture'
                    }
                    alt={item.title}
                    className="rounded-t-lg object-cover h-40 w-full"
                  />
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
    </Card>
  );
}
