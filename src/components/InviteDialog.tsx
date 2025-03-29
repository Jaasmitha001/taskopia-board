
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteData } from "@/types/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const inviteSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string().min(2, { message: "Role is required" }),
});

type InviteDialogProps = {
  className?: string;
};

const InviteDialog: React.FC<InviteDialogProps> = ({ className }) => {
  const { user, inviteTeamMember } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof inviteSchema>) => {
    if (!user?.teamCode) {
      toast.error("You don't have a team code to invite with");
      return;
    }

    setLoading(true);
    
    const inviteData: InviteData = {
      ...data,
      teamCode: user.teamCode,
    };
    
    try {
      const teamCode = await inviteTeamMember(inviteData);
      
      // Create a shareable link (in a real app this would be a deep link)
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/join?code=${teamCode}`;
      setInviteLink(link);
    } catch (error) {
      toast.error("Failed to create invite");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied to clipboard");
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className={className} 
          variant="outline" 
          size="sm"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Team Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your team on Taskopia.
          </DialogDescription>
        </DialogHeader>
        
        {inviteLink ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Share this link with your team member to join your project:
            </p>
            <div className="flex items-center space-x-2">
              <Input 
                value={inviteLink}
                readOnly
                className="flex-1"
              />
              <Button size="icon" onClick={copyToClipboard} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Team code: <span className="font-mono bg-muted px-1 py-0.5 rounded">{user?.teamCode}</span>
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="colleague@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Developer, Designer, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Invite
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Send Invite
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
