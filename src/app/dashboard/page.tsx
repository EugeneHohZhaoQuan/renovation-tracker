// app/dashboard/page.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { InspirationBoard } from '@/components/inspirationBoard';
import { ListTodo } from 'lucide-react';

// --- Mock Components for other new sections ---
const FinancialSummary = () => (
  // Using a darker card for high-impact info
  <Card className="bg-dark-roast text-off-white">
    <CardHeader>
      <CardTitle>Financial Overview</CardTitle>
      <CardDescription className="text-silver-mist">
        Across all active projects
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="text-3xl font-bold">$13,000 / $20,000</div>
      <div className="w-full bg-rich-black rounded-full h-2.5">
        <div
          className="bg-terracotta h-2.5 rounded-full"
          style={{ width: '65%' }}
        ></div>
      </div>
      <p className="text-sm text-silver-mist">
        You&apos;ve spent 65% of your total budget.
      </p>
    </CardContent>
  </Card>
);

const UpcomingTasks = () => (
  <Card className="bg-white">
    <CardHeader>
      <CardTitle className="text-dark-roast">What&apos;s Next?</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-start">
        <ListTodo className="h-5 w-5 text-terracotta mr-3 mt-1 shrink-0" />
        <div>
          <p className="font-medium text-rich-black">Meet with electrician</p>
          <p className="text-sm text-silver-mist">Tomorrow, 10:00 AM</p>
        </div>
      </div>
      <div className="flex items-start">
        <ListTodo className="h-5 w-5 text-terracotta mr-3 mt-1 shrink-0" />
        <div>
          <p className="font-medium text-rich-black">
            Finalize kitchen paint color
          </p>
          <p className="text-sm text-silver-mist">Due in 3 days</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- The Main Dashboard Component ---
export default function Dashboard() {
  const projects = [
    { id: '1', name: 'Kitchen Remodel', budget: 15000, spent: 7500 },
    { id: '2', name: 'Bathroom Update', budget: 5000, spent: 5500 },
  ];

  return (
    // The main padding is now here, not in the layout
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (Wider) */}
          <div className="md:col-span-2 space-y-6">
            <InspirationBoard />
            <div>
              <h2 className="text-2xl font-bold text-dark-roast mb-4">
                Active Projects
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-white hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-dark-roast">
                        {project.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-silver-mist">Budget</p>
                      <p className="text-lg font-semibold text-rich-black">
                        ${project.budget.toLocaleString()}
                      </p>
                      <p className="text-sm text-silver-mist mt-2">Spent</p>
                      <p className="text-lg font-semibold text-rich-black">
                        ${project.spent.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          {/* Right Column (Sidebar) */}
          <div className="md:col-span-1 space-y-6">
            <FinancialSummary />
            <UpcomingTasks />
          </div>
        </div>
      </div>
    </div>
  );
}
