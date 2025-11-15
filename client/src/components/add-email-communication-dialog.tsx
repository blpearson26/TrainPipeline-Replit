import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { insertEmailCommunicationSchema, type InsertEmailCommunication } from "@shared/schema";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AddEmailCommunicationDialogProps {
  clientRequestId: string;
}

export function AddEmailCommunicationDialog({ clientRequestId }: AddEmailCommunicationDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertEmailCommunication>({
    resolver: zodResolver(insertEmailCommunicationSchema),
    defaultValues: {
      clientRequestId,
      senderName: "",
      senderEmail: "",
      recipients: "",
      sentDateTime: new Date(),
      subject: "",
      body: "",
      attachments: null,
      threadId: null,
      createdBy: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertEmailCommunication) => {
      const response = await apiRequest("/api/email-communications", "POST", data);
      if (response.status === 409) {
        throw new Error("Email already logged");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client-requests", clientRequestId, "email-communications"] });
      toast({
        title: "Success",
        description: "Email communication successfully recorded in engagement history.",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record email communication",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertEmailCommunication) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-testid="button-add-email"
        >
          <Mail className="h-4 w-4 mr-2" />
          Add Email Communication
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Email Communication</DialogTitle>
          <DialogDescription>
            Record an email exchange related to this training engagement.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Smith" 
                        {...field} 
                        data-testid="input-sender-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="john.smith@example.com" 
                        {...field}
                        data-testid="input-sender-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipients *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="jane.doe@example.com, team@example.com" 
                      {...field}
                      data-testid="input-recipients"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sentDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time Sent *</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local"
                      {...field}
                      value={field.value instanceof Date 
                        ? field.value.toISOString().slice(0, 16)
                        : field.value
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      data-testid="input-sent-datetime"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Training session schedule confirmation" 
                      {...field}
                      data-testid="input-subject"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Body *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste the email content here..."
                      className="min-h-[200px]"
                      {...field}
                      data-testid="input-body"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="threadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thread ID (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="For grouping related emails"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-thread-id"
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
                disabled={mutation.isPending}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                data-testid="button-save-email"
              >
                {mutation.isPending ? "Saving..." : "Save Email"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
