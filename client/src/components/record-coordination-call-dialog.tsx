import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { insertCoordinationCallSchema, type InsertCoordinationCall, type CoordinationCall, type ScopingCall } from "@shared/schema";
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
import { format } from "date-fns";

interface RecordCoordinationCallDialogProps {
  clientRequestId: string;
  existingCall?: CoordinationCall;
}

export function RecordCoordinationCallDialog({ 
  clientRequestId, 
  existingCall 
}: RecordCoordinationCallDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: scopingCalls } = useQuery<ScopingCall[]>({
    queryKey: ["/api/client-requests", clientRequestId, "scoping-calls"],
  });

  const latestScopingCall = scopingCalls?.[0];

  const form = useForm<InsertCoordinationCall>({
    resolver: zodResolver(insertCoordinationCallSchema),
    defaultValues: existingCall ? {
      clientRequestId: existingCall.clientRequestId,
      callDateTime: existingCall.callDateTime,
      purpose: existingCall.purpose,
      summaryOfDiscussion: existingCall.summaryOfDiscussion,
      attendeeRoles: existingCall.attendeeRoles || "",
      updatedObjectives: existingCall.updatedObjectives || "",
      additionalMaterials: existingCall.additionalMaterials || "",
      deliveryChanges: existingCall.deliveryChanges || "",
      followUpActions: existingCall.followUpActions || "",
      notes: existingCall.notes || "",
      status: existingCall.status,
      createdBy: existingCall.createdBy,
      lastModifiedBy: existingCall.lastModifiedBy,
    } : {
      clientRequestId,
      callDateTime: new Date(),
      purpose: "",
      summaryOfDiscussion: "",
      attendeeRoles: "",
      updatedObjectives: "",
      additionalMaterials: "",
      deliveryChanges: "",
      followUpActions: "",
      notes: "",
      status: "draft",
      createdBy: "",
      lastModifiedBy: "",
    },
  });

  useEffect(() => {
    if (!existingCall && latestScopingCall && open) {
      form.setValue("attendeeRoles", latestScopingCall.attendeeRoles);
    }
  }, [latestScopingCall, existingCall, open, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertCoordinationCall) => {
      return await apiRequest("/api/coordination-calls", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client-requests", clientRequestId, "coordination-calls"] });
      toast({
        title: "Success",
        description: "Coordination call details recorded successfully.",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save coordination call",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertCoordinationCall>) => {
      return await apiRequest(`/api/coordination-calls/${existingCall?.id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client-requests", clientRequestId, "coordination-calls"] });
      toast({
        title: "Success",
        description: "Coordination call updated successfully.",
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update coordination call",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertCoordinationCall) => {
    const submissionData = {
      ...data,
      status: isSubmitting ? "submitted" : "draft",
    };

    if (existingCall) {
      updateMutation.mutate(submissionData);
    } else {
      createMutation.mutate(submissionData);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    form.handleSubmit(onSubmit)();
  };

  const handleSaveDraft = () => {
    setIsSubmitting(false);
    form.handleSubmit(onSubmit)();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existingCall ? (
          <Button
            variant="ghost"
            size="sm"
            data-testid="button-edit-coordination-call"
          >
            <FileText className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            data-testid="button-record-coordination-call"
          >
            <FileText className="h-4 w-4 mr-2" />
            Record Coordination Call
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingCall ? "Edit Coordination Call" : "Record Coordination Call"}
          </DialogTitle>
          <DialogDescription>
            Capture updates, changes, and client instructions from the coordination call. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="callDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Date / Time *</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      data-testid="input-call-datetime"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Call *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} data-testid="select-purpose">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="logistics_update">Logistics Update</SelectItem>
                      <SelectItem value="additional_content">Additional Content Requests</SelectItem>
                      <SelectItem value="instructor_confirmation">Instructor Confirmation</SelectItem>
                      <SelectItem value="participant_confirmation">Participant Confirmation</SelectItem>
                      <SelectItem value="general_update">General Update</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summaryOfDiscussion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary of Discussion Points *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summarize key points discussed during the call"
                      className="min-h-[100px]"
                      {...field}
                      data-testid="textarea-summary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attendeeRoles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendees and Roles</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List attendees and their roles"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-attendees"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="updatedObjectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New or Updated Training Objectives</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Document any changes or additions to training objectives"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-objectives"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalMaterials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Materials or Resources Requested</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any additional materials, resources, or tools requested"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-materials"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryChanges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Changes to Delivery Mode, Dates, or Duration</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Document any changes to how/when the training will be delivered"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-delivery-changes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="followUpActions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow-Up Actions and Responsible Parties</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List action items and who is responsible for each"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-follow-up"
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
                  <FormLabel>Notes / Client Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes or specific client instructions"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-notes"
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
                disabled={isPending}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isPending}
                data-testid="button-save-draft"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                data-testid="button-submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
