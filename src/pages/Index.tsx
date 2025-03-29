
import KanbanBoard from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Taskopia</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="flex items-center">
              <span className="mr-4 text-sm text-muted-foreground hidden sm:inline-block">Team Members</span>
              <div className="avatar-stack -space-x-3">
                {users.map((user) => (
                  <Avatar key={user.id} className="border-2 border-background inline-flex">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 sm:px-6">
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Index;
