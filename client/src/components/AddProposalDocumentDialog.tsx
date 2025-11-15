import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Upload, Link as LinkIcon } from "lucide-react";

const formSchema = z.object({
  documentType: z.enum(["upload", "link"]),
  fileName: z.string().optional(),
  externalLink: z.string().url("Must be a valid URL").optional(),
  versionLabel: z.string().min(1, "Version label is required"),
  notes: z.string().optional(),
  file: z.any().optional(),
}).refine((data) => {
  if (data.documentType === "upload") {
    return data.file !== undefined;
  }
  if (data.documentType === "link") {
    return data.externalLink !== undefined && data.externalLink.length > 0;
  }
  return true;
}, {
  message: "Please provide either a file or a link",
  path: ["documentType"],
});

type FormData = z.infer<typeof formSchema>;

interface AddProposalDocumentDialogProps {
  clientRequestId: string;
}

export function AddProposalDocumentDialog({ clientRequestId }: AddProposalDocumentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "upload",
      fileName: "",
      externalLink: "",
      versionLabel: "",
      notes: "",
    },
  });

  const documentType = form.watch("documentType");

  const createDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/proposal-documents", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposal-documents", clientRequestId] });
      toast({
        title: "Success",
        description: "Proposal document added successfully",
      });
      setOpen(false);
      form.reset();
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add proposal document",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [".ppt", ".pptx", ".doc", ".docx", ".pdf", ".xls", ".xlsx", ".xlsm"];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: "Please select a .ppt, .docx, .pdf, or Excel file",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      form.setValue("file", file);
      form.setValue("fileName", file.name);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      let documentData: any = {
        clientRequestId,
        documentType: data.documentType,
        versionLabel: data.versionLabel,
        notes: data.notes || null,
        isCurrentVersion: 0,
      };

      if (data.documentType === "upload" && selectedFile) {
        const uploadResponse = await apiRequest("POST", "/api/object-storage/generate-upload-url", {
          fileName: selectedFile.name,
          contentType: selectedFile.type,
        });

        const { uploadUrl, fileUrl } = await uploadResponse.json();

        await fetch(uploadUrl, {
          method: "PUT",
          body: selectedFile,
          headers: {
            "Content-Type": selectedFile.type,
          },
        });

        documentData.fileName = selectedFile.name;
        documentData.fileUrl = fileUrl;
      } else if (data.documentType === "link") {
        documentData.externalLink = data.externalLink;
      }

      await createDocumentMutation.mutateAsync(documentData);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-document">
          <Upload className="mr-2 h-4 w-4" />
          Add Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Proposal Document</DialogTitle>
          <DialogDescription>
            Upload a file or provide a link to an external document
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                      data-testid="radio-document-type"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upload" id="upload" data-testid="radio-upload" />
                        <label htmlFor="upload" className="cursor-pointer">Upload File</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="link" id="link" data-testid="radio-link" />
                        <label htmlFor="link" className="cursor-pointer">External Link</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {documentType === "upload" && (
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>File (.ppt, .docx, .pdf, Excel)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".ppt,.pptx,.doc,.docx,.pdf,.xls,.xlsx,.xlsm"
                        onChange={handleFileChange}
                        data-testid="input-file"
                      />
                    </FormControl>
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground" data-testid="text-selected-file">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {documentType === "link" && (
              <FormField
                control={form.control}
                name="externalLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Link (SharePoint/Drive)</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <LinkIcon className="h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          placeholder="https://..."
                          {...field}
                          data-testid="input-external-link"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="versionLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., v1.0, Draft, Final"
                      {...field}
                      data-testid="input-version-label"
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
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Key updates or description..."
                      {...field}
                      data-testid="input-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
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
                disabled={createDocumentMutation.isPending}
                data-testid="button-submit-document"
              >
                {createDocumentMutation.isPending ? "Adding..." : "Add Document"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
