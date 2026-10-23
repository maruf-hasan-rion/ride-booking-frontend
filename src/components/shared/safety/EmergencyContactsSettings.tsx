import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Shield, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEmergencyContacts, type EmergencyContact, type EmergencyRole } from "@/hooks/useEmergencyContacts";

type EmergencyContactsSettingsProps = {
  role: EmergencyRole;
  title: string;
  description: string;
};

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name is too long."),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{7,17}$/, "Enter a valid phone number."),
  relationship: z.string().trim().max(40, "Relationship is too long.").optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const DEFAULT_VALUES: ContactFormValues = {
  name: "",
  phone: "",
  relationship: "",
};

const toFormValues = (contact: EmergencyContact): ContactFormValues => ({
  name: contact.name,
  phone: contact.phone,
  relationship: contact.relationship || "",
});

export const EmergencyContactsSettings = ({
  role,
  title,
  description,
}: EmergencyContactsSettingsProps) => {
  const { contacts, removeContact, upsertContact } = useEmergencyContacts(role);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const resetEditingState = () => {
    setEditingId(null);
    form.reset(DEFAULT_VALUES);
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    form.reset(toFormValues(contact));
  };

  const handleDelete = (id: string) => {
    removeContact(id);
    if (editingId === id) {
      resetEditingState();
    }
    toast.success("Emergency contact removed.");
  };

  const onSubmit = (values: ContactFormValues) => {
    upsertContact(
      {
        name: values.name,
        phone: values.phone,
        relationship: values.relationship || "",
      },
      editingId || undefined
    );

    toast.success(editingId ? "Emergency contact updated." : "Emergency contact added.");
    resetEditingState();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contacts.length > 0 ? (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <UserRound className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      {contact.relationship ? (
                        <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleEdit(contact)}>
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No emergency contacts added yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            {editingId ? "Update Contact" : "Add Contact"}
          </CardTitle>
          <CardDescription>
            Keep at least one trusted person for quick SOS messages. Contacts are
            stored on this device for this account only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+8801XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Example: Sister, Friend, Parent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? "Update Contact" : "Save Contact"}
                </Button>
                {editingId ? (
                  <Button type="button" variant="outline" onClick={resetEditingState}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
