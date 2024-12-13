"use client";

import { Button } from "@/app/components/ui/button";
import { Heading } from "@/app/components/ui/heading";
import { Separator } from "@/app/components/ui/separator";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ApiAlert } from "@/app/components/ui/ api-alert";
import { useOrigin } from "@/app/components/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, "Store name is required"),
});

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // For delete confirmation
   const origin = useOrigin();
  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${initialData.id}`, {
        action: "update", // Specify the action for the server
        name: data.name,
      });

      toast.success("Store updated successfully");
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      console.error("Error updating store:", error);
      toast.error("Error updating store");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!open) {
      setOpen(true); // Show confirmation prompt
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`/api/stores/${initialData.id}`, {
        action: "delete", // Specify the action for the server
      });
      toast.success("Store deleted successfully");
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      console.error("Error deleting store:", error);
      toast.error("Error deleting store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage store preferences"
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={onDelete}
          disabled={loading}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      {open && (
        <div className="confirmation-modal space-x-2">
          <p>Are you sure you want to delete this store?</p>
          <Button onClick={onDelete} disabled={loading}>
            Delete
          </Button>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            className="ml-auto"
            type="submit"
          >
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator/>
      <ApiAlert title="NEXT_PUBLIC_API_URL" 
      description={`${origin}/api/${initialData.id}`} 
      variant={"public"}/>
    </>
  );
};
 