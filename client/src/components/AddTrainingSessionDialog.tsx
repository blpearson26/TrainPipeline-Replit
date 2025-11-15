import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, AlertTriangle } from "lucide-react";
import { type TrainingSession, type Client } from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";

const formSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  clientName: z.string().min(1, "Client name is required"),
  proposalId: z.string().optional(),
  title: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  deliveryMode: z.enum(["virtual", "on-site", "hybrid"]),
  location: z.string().optional(),
  virtualLink: z.string().optional(),
  instructor: z.string().min(1, "Instructor is required"),
  facilitators: z.string().optional(),
  status: z.enum(["tentative", "confirmed", "completed"]),
  participantCount: z.coerce.number().optional(),
}).superRefine((data, ctx) => {
  // Validate location is provided for on-site or hybrid
  if ((data.deliveryMode === "on-site" || data.deliveryMode === "hybrid") && !data.location?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Location is required for on-site and hybrid delivery modes",
      path: ["location"],
    });
  }
  // Validate virtual link is provided for virtual or hybrid
  if ((data.deliveryMode === "virtual" || data.deliveryMode === "hybrid") && !data.virtualLink?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Virtual meeting link is required for virtual and hybrid delivery modes",
      path: ["virtualLink"],
    });
  }
});

type FormData = z.infer<typeof formSchema>;

interface AddTrainingSessionDialogProps {
  session?: TrainingSession;
  trigger?: React.ReactNode;
}

export function AddTrainingSessionDialog({ session, trigger }: AddTrainingSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [conflictingSessions, setConflictingSessions] = useState<TrainingSession[]>([]);
  const [pendingSessionData, setPendingSessionData] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!session;
  const { user } = useAuth();

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: session ? {
      clientId: session.clientId,
      clientName: session.clientName,
      title: session.title,
      description: session.description ?? undefined,
      startDate: new Date(session.startDate).toISOString().split('T')[0],
      endDate: new Date(session.endDate).toISOString().split('T')[0],
      startTime: new Date(session.startDate).toTimeString().slice(0, 5),
      endTime: new Date(session.endDate).toTimeString().slice(0, 5),
      deliveryMode: session.deliveryMode as "virtual" | "on-site" | "hybrid",
      location: session.location ?? undefined,
      virtualLink: session.virtualLink ?? undefined,
      instructor: session.instructor,
      facilitators: session.facilitators?.join(", ") ?? undefined,
      status: session.status as "tentative" | "confirmed" | "completed",
      participantCount: session.participantCount ?? undefined,
      proposalId: session.proposalId ?? undefined,
    } : {
      clientId: "",
      clientName: "",
      title: "",
      description: undefined,
      startDate: "",
      endDate: "",
      startTime: "09:00",
      endTime: "17:00",
      deliveryMode: "virtual",
      location: undefined,
      virtualLink: undefined,
      instructor: "",
      facilitators: undefined,
      status: "tentative",
      participantCount: undefined,
      proposalId: undefined,
    },
  });

  const deliveryMode = form.watch("deliveryMode");
  const selectedClientId = form.watch("clientId");

  // Update clientName when client is selected
  const handleClientChange = (clientId: string) => {
    const client = clients?.find(c => c.id === clientId);
    if (client) {
      form.setValue("clientName", client.companyName);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/training-sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-sessions"] });
      toast({
        title: "Success",
        description: "Event saved successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create training session",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", `/api/training-sessions/${session?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-sessions"] });
      toast({
        title: "Success",
        description: "Event saved successfully",
      });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update training session",
        variant: "destructive",
      });
    },
  });

  const checkForConflicts = async (sessionData: any) => {
    try {
      const response = await apiRequest("POST", "/api/training-sessions/conflicts", {
        instructor: sessionData.instructor,
        startDate: sessionData.startDate,
        endDate: sessionData.endDate,
        excludeSessionId: isEditing ? session?.id : undefined,
      });
      return response as TrainingSession[];
    } catch (error) {
      console.error("Error checking for conflicts:", error);
      return [];
    }
  };

  const saveSession = async (sessionData: any, conflictOverride = false) => {
    if (conflictOverride && conflictingSessions.length > 0) {
      const conflictNote = `Instructor already scheduled for: ${conflictingSessions.map(s => `"${s.title}" (${format(new Date(s.startDate), 'MMM d, yyyy')})`).join(', ')}`;
      sessionData.conflictOverride = true;
      sessionData.conflictNote = conflictNote;
    }

    if (isEditing) {
      await updateMutation.mutateAsync(sessionData);
    } else {
      await createMutation.mutateAsync(sessionData);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create or edit training sessions",
        variant: "destructive",
      });
      return;
    }

    try {
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);

      // Clear mode-specific fields based on delivery mode to avoid sending stale data
      let location = null;
      let virtualLink = null;
      
      if (data.deliveryMode === "on-site" || data.deliveryMode === "hybrid") {
        location = data.location || null;
      }
      
      if (data.deliveryMode === "virtual" || data.deliveryMode === "hybrid") {
        virtualLink = data.virtualLink || null;
      }

      const sessionData: any = {
        clientId: data.clientId,
        clientName: data.clientName,
        title: data.title,
        description: data.description || null,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        deliveryMode: data.deliveryMode,
        location,
        virtualLink,
        instructor: data.instructor,
        facilitators: data.facilitators ? data.facilitators.split(",").map((f: string) => f.trim()).filter((f: string) => f) : null,
        status: data.status,
        participantCount: data.participantCount || null,
        proposalId: data.proposalId || null,
      };

      // Include createdBy when creating a new session
      if (!isEditing) {
        sessionData.createdBy = user.id;
      }

      // Check for conflicts before saving
      const conflicts = await checkForConflicts(sessionData);
      
      if (conflicts.length > 0) {
        setConflictingSessions(conflicts);
        setPendingSessionData(sessionData);
        setShowConflictWarning(true);
      } else {
        await saveSession(sessionData, false);
      }
    } catch (error) {
      console.error("Error saving training session:", error);
    }
  };

  const handleConfirmOverride = async () => {
    if (pendingSessionData) {
      setShowConflictWarning(false);
      await saveSession(pendingSessionData, true);
      setPendingSessionData(null);
      setConflictingSessions([]);
    }
  };

  const handleCancelOverride = () => {
    setShowConflictWarning(false);
    setPendingSessionData(null);
    setConflictingSessions([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid="button-add-session">
            <Plus className="h-4 w-4 mr-2" />
            Add New Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the training session details below." : "Enter the details for the new training session."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleClientChange(value);
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-client">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event / Course Name *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., Introduction to AI & Machine Learning" 
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief description of the training session"
                      className="resize-none"
                      rows={2}
                      data-testid="input-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="date" 
                        data-testid="input-start-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="time" 
                        data-testid="input-start-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="date" 
                        data-testid="input-end-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="time" 
                        data-testid="input-end-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deliveryMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Mode *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-delivery-mode">
                        <SelectValue placeholder="Select delivery mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="on-site">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(deliveryMode === "on-site" || deliveryMode === "hybrid") && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Conference Room A, Building 1"
                        data-testid="input-location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(deliveryMode === "virtual" || deliveryMode === "hybrid") && (
              <FormField
                control={form.control}
                name="virtualLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Virtual Meeting Link *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., https://zoom.us/j/123456"
                        data-testid="input-virtual-link"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor(s) *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., Dr. Sarah Williams"
                      data-testid="input-instructor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilitators"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facilitator(s)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., Alex Thompson, Jordan Lee (comma-separated)"
                      data-testid="input-facilitators"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tentative">Tentative</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="participantCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant Count</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      placeholder="e.g., 25"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      data-testid="input-participant-count"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-session"
              >
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

      <AlertDialog open={showConflictWarning} onOpenChange={setShowConflictWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Instructor Already Scheduled
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <p className="font-medium">
                  {form.watch("instructor")} is already scheduled for the following event(s) during this time:
                </p>
                <div className="space-y-2">
                  {conflictingSessions.map((conflict) => (
                    <div 
                      key={conflict.id} 
                      className="bg-muted p-3 rounded-md text-sm"
                      data-testid={`conflict-session-${conflict.id}`}
                    >
                      <div className="font-semibold">{conflict.title}</div>
                      <div className="text-muted-foreground">
                        {conflict.clientName} • {format(new Date(conflict.startDate), 'MMM d, yyyy h:mm a')} - {format(new Date(conflict.endDate), 'MMM d, yyyy h:mm a')}
                      </div>
                      <div className="text-muted-foreground capitalize">
                        Status: {conflict.status}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm">
                  You can still save this event, but a note will be added to the event description for audit tracking.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelOverride} data-testid="button-cancel-override">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOverride} data-testid="button-confirm-override">
              Save Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
