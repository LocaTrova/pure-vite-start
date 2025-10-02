import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Copy, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function Setup() {
  const [spreadsheetId, setSpreadsheetId] = useState<string>("");
  const { toast } = useToast();

  const createSheetMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/setup-sheets", {
        method: "POST",
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Errore nella creazione del foglio");
      }
      
      return result;
    },
    onSuccess: (data) => {
      setSpreadsheetId(data.spreadsheetId);
      toast({
        title: "Foglio creato!",
        description: "Google Sheet creato con successo. Copia l'ID qui sotto.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella creazione del foglio.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(spreadsheetId);
    toast({
      title: "Copiato!",
      description: "ID copiato negli appunti",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Setup Google Sheets
          </h1>
          <p className="text-lg text-muted-foreground">
            Crea automaticamente il foglio Google Sheets per raccogliere le richieste
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crea il tuo foglio Google Sheets</CardTitle>
            <CardDescription>
              Clicca il bottone qui sotto per creare automaticamente un foglio con tutte le colonne necessarie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!spreadsheetId ? (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Prima di iniziare</AlertTitle>
                  <AlertDescription>
                    Assicurati di aver autorizzato l'integrazione Google Sheets nelle impostazioni di Replit
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => createSheetMutation.mutate()}
                  disabled={createSheetMutation.isPending}
                  className="w-full"
                  size="lg"
                  data-testid="button-create-sheet"
                >
                  {createSheetMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creazione in corso...
                    </>
                  ) : (
                    "Crea Google Sheet"
                  )}
                </Button>
              </>
            ) : (
              <>
                <Alert className="bg-primary/5 border-primary">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Foglio creato con successo!</AlertTitle>
                  <AlertDescription>
                    Il tuo Google Sheet è pronto. Copia l'ID qui sotto e configuralo come Secret.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="spreadsheet-id">Spreadsheet ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="spreadsheet-id"
                      value={spreadsheetId}
                      readOnly
                      className="font-mono text-sm"
                      data-testid="input-spreadsheet-id"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      data-testid="button-copy-id"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-sm">Prossimi passi:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Copia l'ID del foglio (clicca l'icona copia)</li>
                    <li>Vai nelle impostazioni Secrets di Replit</li>
                    <li>Modifica il Secret <code className="bg-background px-1 rounded">GOOGLE_SHEETS_ID</code> con questo nuovo ID</li>
                    <li>Riavvia l'applicazione</li>
                    <li>Il form invierà ora i dati al nuovo foglio!</li>
                  </ol>
                </div>

                <div className="pt-4">
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                    data-testid="link-open-sheet"
                  >
                    Apri il foglio in Google Sheets →
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
