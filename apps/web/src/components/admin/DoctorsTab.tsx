import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Doctor, specialties } from "@/data/mockData";
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

export const DoctorsTab = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({ name: "", crm: "", specialty: "", experience: "", rating: "5" });
  const { toast } = useToast();

  useEffect(() => {
    setDoctors(getDoctors());
  }, []);

  const resetForm = () => {
    setFormData({ name: "", crm: "", specialty: "", experience: "", rating: "5" });
    setEditingDoctor(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doctorData = {
      name: formData.name,
      crm: formData.crm,
      specialty: formData.specialty,
      experience: formData.experience,
      rating: parseFloat(formData.rating),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.replace(/\s/g, "")}`,
    };

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, doctorData);
      toast({ title: "Médico atualizado com sucesso!" });
    } else {
      addDoctor(doctorData);
      toast({ title: "Médico cadastrado com sucesso!" });
    }

    setDoctors(getDoctors());
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      crm: doctor.crm,
      specialty: doctor.specialty,
      experience: doctor.experience,
      rating: doctor.rating.toString(),
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteDoctor(id);
    setDoctors(getDoctors());
    toast({ title: "Médico removido com sucesso!" });
  };

  const getSpecialtyName = (id: string) => {
    return specialties.find((s) => s.id === id)?.name || id;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Médicos Cadastrados</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo Médico</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Editar Médico" : "Novo Médico"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crm">CRM</Label>
                <Input id="crm" value={formData.crm} onChange={(e) => setFormData({ ...formData, crm: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })} required>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {specialties.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experiência</Label>
                <Input id="experience" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} placeholder="Ex: 10 anos de experiência" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Avaliação</Label>
                <Input id="rating" type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">{editingDoctor ? "Salvar" : "Cadastrar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CRM</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Experiência</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell>{doctor.crm}</TableCell>
                <TableCell>{getSpecialtyName(doctor.specialty)}</TableCell>
                <TableCell>{doctor.experience}</TableCell>
                <TableCell>{doctor.rating}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(doctor)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>Tem certeza que deseja excluir {doctor.name}?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(doctor.id)}>Excluir</AlertDialogAction>
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
