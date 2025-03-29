
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import InviteDialog from "@/components/InviteDialog";
import { 
  UserPlus, 
  LogOut, 
  Settings,
  Users, 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Don't render anything if not authenticated, the useEffect will redirect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm border-primary/10">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Taskopia
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {user.isAdmin && (
              <InviteDialog className="hidden md:flex" />
            )}
            
            <div className="flex items-center">
              <span className="mr-4 text-sm text-muted-foreground hidden sm:inline-block">
                Team Members
              </span>
              <div className="avatar-stack -space-x-3">
                {users.map((teamUser) => (
                  <Avatar 
                    key={teamUser.id} 
                    className={`border-2 ${
                      teamUser.id === user.id 
                        ? "border-indigo-300 ring-2 ring-indigo-400/20" 
                        : "border-background"
                    } inline-flex hover:translate-y-[-2px] transition-transform`}
                  >
                    <AvatarImage src={teamUser.avatar} alt={teamUser.name} />
                    <AvatarFallback 
                      className={`${
                        teamUser.id === user.id 
                          ? "bg-indigo-100 text-indigo-800" 
                          : ""
                      }`}
                    >
                      {teamUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Users className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Your Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.role}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Invite Team Member</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Project Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, <span className="text-primary font-medium">{user.name}</span>
            </p>
          </div>
          
          <div className="flex space-x-2">
            {user.isAdmin && (
              <InviteDialog className="md:hidden" />
            )}
          </div>
        </div>
        
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Index;
