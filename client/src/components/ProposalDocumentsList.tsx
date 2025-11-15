import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ProposalDocument } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Star, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ProposalDocumentsListProps {
  clientRequestId: string;
}

export function ProposalDocumentsList({ clientRequestId }: ProposalDocumentsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery<ProposalDocument[]>({
    queryKey: ["/api/proposal-documents", clientRequestId],
    queryFn: async () => {
      const response = await fetch(`/api/proposal-documents?clientRequestId=${clientRequestId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch documents");
      return response.json();
    },
  });

  const markCurrentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return await apiRequest("POST", `/api/proposal-documents/${documentId}/mark-current`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposal-documents", clientRequestId] });
      toast({
        title: "Success",
        description: "Document marked as current version",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark document as current",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return await apiRequest("DELETE", `/api/proposal-documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposal-documents", clientRequestId] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const handleDownload = async (document: ProposalDocument) => {
    try {
      if (document.documentType === "upload" && document.fileUrl) {
        const response = await apiRequest("POST", "/api/object-storage/generate-download-url", {
          fileUrl: document.fileUrl,
        });
        const { downloadUrl } = await response.json();
        window.open(downloadUrl, "_blank");
      } else if (document.documentType === "link" && document.externalLink) {
        window.open(document.externalLink, "_blank");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading documents...</div>;
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="text-no-documents">
        <p>No proposal documents added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <Card key={document.id} className="p-4" data-testid={`card-document-${document.id}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium truncate" data-testid={`text-filename-${document.id}`}>
                  {document.documentType === "upload" ? document.fileName : "External Link"}
                </h4>
                {document.isCurrentVersion === 1 && (
                  <Badge variant="default" className="gap-1" data-testid={`badge-current-${document.id}`}>
                    <Star className="h-3 w-3" />
                    Current
                  </Badge>
                )}
                <Badge variant="outline" data-testid={`badge-version-${document.id}`}>
                  {document.versionLabel}
                </Badge>
              </div>

              {document.documentType === "link" && document.externalLink && (
                <p className="text-sm text-muted-foreground truncate mb-2" data-testid={`text-link-${document.id}`}>
                  {document.externalLink}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span data-testid={`text-uploaded-${document.id}`}>
                  {document.uploadedAt && format(new Date(document.uploadedAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
                <span data-testid={`text-type-${document.id}`}>
                  {document.documentType === "upload" ? "Uploaded File" : "External Link"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDownload(document)}
                title={document.documentType === "upload" ? "Download" : "Open Link"}
                data-testid={`button-download-${document.id}`}
              >
                {document.documentType === "upload" ? (
                  <Download className="h-4 w-4" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
              </Button>

              {document.isCurrentVersion !== 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => markCurrentMutation.mutate(document.id)}
                  disabled={markCurrentMutation.isPending}
                  title="Mark as Current Version"
                  data-testid={`button-mark-current-${document.id}`}
                >
                  <Star className="h-4 w-4" />
                </Button>
              )}

              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this document?")) {
                    deleteMutation.mutate(document.id);
                  }
                }}
                disabled={deleteMutation.isPending}
                title="Delete Document"
                data-testid={`button-delete-${document.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
