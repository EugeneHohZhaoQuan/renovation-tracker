// components/inspiration-board.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

// Mock data for the inspiration items
const inspirationItems = [
  {
    id: 1,
    title: 'Minimalist Kitchen Cabinets',
    imageUrl:
      'https://images.unsplash.com/photo-1600585152225-3579fe9d7ae2?w=800&q=80', // Placeholder image
    link: 'https://www.pinterest.com/search/pins/?q=minimalist%20kitchen',
    notes: 'Love the clean lines and lack of hardware.',
    addedBy: 'You',
  },
  {
    id: 2,
    title: 'Terracotta Bathroom Tiles',
    imageUrl:
      'https://images.unsplash.com/photo-1603959108122-cde334335e27?w=800&q=80', // Placeholder image
    link: 'https://example.com/tiles',
    notes:
      'This could work for the guest bathroom floor. Matches our color palette!',
    addedBy: 'Girlfriend',
  },
  {
    id: 3,
    title: 'DIY Floating Shelves',
    imageUrl:
      'https://images.unsplash.com/photo-1599494029267-2d3c2a355f35?w=800&q=80', // Placeholder image
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    notes: 'A potential weekend project for the living room.',
    addedBy: 'You',
  },
];

export function InspirationBoard() {
  return (
    <Card className="col-span-1 md:col-span-2 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-dark-roast">Inspiration Board</CardTitle>
          <CardDescription>Shared ideas for our dream home.</CardDescription>
        </div>
        <Button className="bg-terracotta hover:bg-terracotta/90">
          Add Idea
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inspirationItems.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="rounded-t-lg object-cover h-40 w-full"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-rich-black">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 flex-grow">
                  {item.notes}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-silver-mist">
                    Added by {item.addedBy}
                  </span>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4 text-terracotta" />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
