"use client";

import { Button } from "@/app/components/ui/button";
import { Heading } from "@/app/components/ui/heading";
import { Separator } from "@/app/components/ui/separator";
import { Colour, Size } from "@prisma/client";
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
import { Modal } from "@/app/components/ui/modal"; // Add a Modal component to show confirmation.

interface SizeFormProps {
  initialData: Colour | null;
}

const formSchema = z.object({
  name: z.string().min(1, "Size name is required"),
  value: z.string().min(1, "Size value is required"),
});

type SizeFormValues = z.infer<typeof formSchema>;

export const ColourForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { storeId, sizeId } = useParams<{ storeId: string; sizeId: string }>() || {};
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const origin = useOrigin();

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      value: initialData?.value || "",
    },
  });

  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData
    ? "Edit the details of your size"
    : "Add a new size";
  const toastMessage = initialData
    ? "Size updated successfully"
    : "Size created successfully";
  const actionLabel = initialData ? "Save Changes" : "Create Size";

  const onDelete = async () => {
    try {
      setLoading(true);
      if (storeId && sizeId) {
        await axios.delete(`/api/${storeId}/sizes/${sizeId}`);
        toast.success("Size deleted successfully");
        router.push(`/${storeId}/sizes`); // Redirect after deletion.
      }
    } catch (error) {
      toast.error("Error deleting size");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      let response;
      if (initialData) {
        if (storeId && sizeId) {
          response = await axios.patch(`/api/${storeId}/sizes/${sizeId}`, data);
        }
      } else {
        if (storeId) {
          response = await axios.post(`/api/${storeId}/sizes`, data);
        }
      }
      toast.success(toastMessage);

      // Redirect to the sizes page after successful update
      if (!initialData && response?.data?.id) {
        router.push(`/${storeId}/sizes`);
      } else {
        router.push(`/${storeId}/sizes`); // This line will redirect you after updating the size
      }
    } catch (error) {
      toast.error("Error saving size");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-80">
          <div className="grid grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Size Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Size Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter size value"
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
        description="Are you sure you want to delete this size? This action cannot be undone."
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
