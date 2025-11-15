import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { insertScopingCallSchema, type InsertScopingCall, type ScopingCall } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

const formSchema = insertScopingCallSchema.omit({
  createdBy: true,
  lastModifiedBy: true,
});

type FormData = z.infer<typeof formSchema>;

interface RecordScopingCallDialogProps {
  clientRequestId: string;
  existingCall?: ScopingCall;
}

export function RecordScopingCallDialog({
  clientRequestId,
  existingCall,
}: RecordScopingCallDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const isEditing = !!existingCall;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: existingCall
      ? {
          clientRequestId: existingCall.clientRequestId,
          attendeeRoles: existingCall.attendeeRoles,
          trainingObjectives: existingCall.trainingObjectives,
          deliveryMode: existingCall.deliveryMode,
          duration: existingCall.duration,
          preferredTimeWindow: existingCall.preferredTimeWindow,
          numberOfParticipants: existingCall.numberOfParticipants,
          specialRequirements: existingCall.specialRequirements || "",
          notes: existingCall.notes || "",
          status: existingCall.status,
        }
      : {
          clientRequestId,
          attendeeRoles: "",
          trainingObjectives: "",
          deliveryMode: "virtual",
          duration: "",
          preferredTimeWindow: "",
          numberOfParticipants: 0,
          specialRequirements: "",
          notes: "",
          status: "draft",
        },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (isEditing) {
        const res = await apiRequest("PATCH", `/api/scoping-calls/${existingCall.id}`, data);
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/scoping-calls", data);
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client-requests", clientRequestId, "scoping-calls"] });
      toast({
        title: "Success",
        description: `Scoping call ${isEditing ? "updated" : "saved"} successfully`,
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "save"} scoping call`,
        variant: "destructive",
      });
    },
  });

  const onSaveDraft = (data: FormData) => {
    saveMutation.mutate({ ...data, status: "draft" });
  };

  const onSubmit = (data: FormData) => {
    saveMutation.mutate({ ...data, status: "submitted" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditing ? "outline" : "default"} data-testid="button-record-scoping-call">
          <FileText className="h-4 w-4 mr-2" />
          {isEditing ? "Edit Scoping Call" : "Record Scoping Call"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Record"} Scoping Call</DialogTitle>
          <DialogDescription>
            Capture detailed information from the client scoping call. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="attendeeRoles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendee Roles *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Executives, Managers, Analysts"
                      {...field}
                      data-testid="input-attendee-roles"
                    />
                  </FormControl>
                  <FormDescription>
                    Who will be attending the training?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trainingObjectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Objectives *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="At the end of the course, participants should be able to..."
                      className="resize-none min-h-32"
                      {...field}
                      data-testid="input-objectives"
                    />
                  </FormControl>
                  <FormDescription>
                    What should participants be able to do after the training?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deliveryMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Mode *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-delivery-mode">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="virtual" data-testid="option-virtual">Virtual</SelectItem>
                        <SelectItem value="on-site" data-testid="option-on-site">On-site</SelectItem>
                        <SelectItem value="hybrid" data-testid="option-hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 2 days, 3 hours"
                        {...field}
                        data-testid="input-duration"
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
                name="preferredTimeWindow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time Window *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Q1 2025, next month"
                        {...field}
                        data-testid="input-time-window"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOfParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Participants (Est.) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-participants"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements / Constraints (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., technical setup, materials, language requirements"
                      className="resize-none min-h-20"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-requirements"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes / Additional Context (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Capture any qualitative details from the conversation"
                      className="resize-none min-h-20"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={form.handleSubmit(onSaveDraft)}
                disabled={saveMutation.isPending}
                data-testid="button-save-draft"
              >
                {saveMutation.isPending ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={saveMutation.isPending}
                data-testid="button-submit"
              >
                {saveMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
