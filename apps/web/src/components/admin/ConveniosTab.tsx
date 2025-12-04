import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHealthInsurancesQuery } from "@/hooks/queries/useHealthInsurancesQuery";
import { useCreateHealthInsuranceMutation } from "@/hooks/mutations/useCreateHealthInsuranceMutation";
import { useUpdateHealthInsuranceMutation } from "@/hooks/mutations/useUpdateHealthInsuranceMutation";
import { useDeleteHealthInsuranceMutation } from "@/hooks/mutations/useDeleteHealthInsuranceMutation";

interface Convenio {
  id: string;
  name: string;
}

export const ConveniosTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingConvenio, setEditingConvenio] = useState<Convenio | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const { toast } = useToast();

  const { data: convenios = [] } = useHealthInsurancesQuery();
  const createHealthInsuranceMutation = useCreateHealthInsuranceMutation();
  const updateHealthInsuranceMutation = useUpdateHealthInsuranceMutation();
  const deleteHealthInsuranceMutation = useDeleteHealthInsuranceMutation();

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingConvenio(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingConvenio) {
        await updateHealthInsuranceMutation.mutateAsync({ id: editingConvenio.id, ...formData });
        toast({ title: "Convênio atualizado com sucesso!" });
      } else {
        await createHealthInsuranceMutation.mutateAsync(formData);
        toast({ title: "Convênio cadastrado com sucesso!" });
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: "Erro ao salvar convênio" });
    }
  };

  const handleEdit = (convenio: Convenio) => {
    setEditingConvenio(convenio);
    setFormData({ name: convenio.name });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHealthInsuranceMutation.mutateAsync(id);
      toast({ title: "Convênio removido com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao remover convênio" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Convênios Cadastrados</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo Convênio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingConvenio ? "Editar Convênio" : "Novo Convênio"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">{editingConvenio ? "Salvar" : "Cadastrar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {convenios.map((convenio: Convenio) => (
              <TableRow key={convenio.id}>
                <TableCell className="font-medium">{convenio.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(convenio)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>Tem certeza que deseja excluir {convenio.name}?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(convenio.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
