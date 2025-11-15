import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import type { EmailCommunication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface EmailCommunicationDetailProps {
  email: EmailCommunication;
  clientName: string;
}

export function EmailCommunicationDetail({ email, clientName }: EmailCommunicationDetailProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const copyEmailContent = () => {
    const emailText = `
From: ${email.senderName} <${email.senderEmail}>
To: ${email.recipients}
Date: ${format(new Date(email.sentDateTime), "MMMM d, yyyy 'at' h:mm a")}
Subject: ${email.subject}

${email.body}
    `.trim();

    navigator.clipboard.writeText(emailText);
    toast({
      title: "Copied to clipboard",
      description: "Email content has been copied.",
    });
  };

  return (
    <Card data-testid={`email-${email.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-1">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-medium truncate">
                {email.subject}
              </CardTitle>
              <CardDescription className="mt-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">From:</span>
                  <span className="truncate">{email.senderName} &lt;{email.senderEmail}&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">To:</span>
                  <span className="truncate">{email.recipients}</span>
                </div>
                <div>
                  {email.sentDateTime && format(new Date(email.sentDateTime), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="button-toggle-email-body"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyEmailContent}
              data-testid="button-copy-email"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 text-sm">Email Body</h4>
            <div 
              className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-4 rounded-md"
              data-testid="text-email-body"
            >
              {email.body}
            </div>
          </div>

          {email.threadId && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">Thread:</span>
                <span>{email.threadId}</span>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
