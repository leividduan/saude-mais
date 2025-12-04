import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const BloqueioAgenda = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Bloquear Agenda</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bloquear um período na agenda</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input id="startDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input id="endDate" type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Textarea id="reason" placeholder="Ex: Férias, Conferência, etc." />
          </div>
          <Button type="submit" className="w-full">
            Confirmar Bloqueio
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
