"use client";

import { Button } from "@/app/components/ui/button";
import { Heading } from "@/app/components/ui/heading";
import { Separator } from "@/app/components/ui/separator";
import { Billboard } from "@prisma/client";
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
import { useParams } from "next/navigation";
import { useOrigin } from "@/app/components/hooks/use-origin";
import ImageUpload from "@/app/components/ui/image-upload";
import { Modal } from "@/app/components/ui/modal"; // Add a Modal component to show confirmation.

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1, "Billboard label is required"),
  imageUrl: z.array(z.string().url("Each image must be a valid URL")),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { storeId, billboardId } = useParams<{ storeId: string; billboardId: string }>() || {};
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const origin = useOrigin();

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label || "",
      imageUrl: initialData?.imageUrl || [],
    },
  });

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData
    ? "Edit the details of your billboard"
    : "Add a new billboard";
  const toastMessage = initialData
    ? "Billboard updated successfully"
    : "Billboard created successfully";
  const actionLabel = initialData ? "Save Changes" : "Create Billboard";

  const onDelete = async () => {
    try {
      setLoading(true);
      if (storeId && billboardId) {
        await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
        toast.success("Billboard deleted successfully");
        router.push(`/${storeId}/billboards`); // Redirect after deletion.
      }
    } catch (error) {
      toast.error("Error deleting billboard");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      let response;
      if (initialData) {
        if (storeId && billboardId) {
          response = await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data);
        }
      } else {
        if (storeId) {
          response = await axios.post(`/api/${storeId}/billboards`, data);
        }
      }
      toast.success(toastMessage);

      if (!initialData && response?.data?.id) {
        router.push(`/${storeId}/billboards`);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error("Error saving billboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            onClick={() => setDeleteModalOpen(true)}
            disabled={loading}
          >
            <Trash className="h-4 w-4 " />
            
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange(field.value.filter((item) => item !== url))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-8 w-60">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Billboard Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {actionLabel}
          </Button>
        </form>
      </Form>
      
      <Modal
  isOpen={deleteModalOpen}
  setIsOpen={() => setDeleteModalOpen(false)} // Use the correct onClose prop
  title="Confirm Deletion"
  description="Are you sure you want to delete this billboard? This action cannot be undone."
>
  <div className="flex justify-end gap-4">
    <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
      Cancel
    </Button>
    <Button variant="destructive" onClick={onDelete} disabled={loading}>
      Delete
    </Button>
  </div>
</Modal>

    </>
  );
};
