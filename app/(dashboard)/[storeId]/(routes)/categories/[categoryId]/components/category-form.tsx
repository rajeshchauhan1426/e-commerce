"use client";

import { Button } from "@/app/components/ui/button";
import { Heading } from "@/app/components/ui/heading";
import { Separator } from "@/app/components/ui/separator";
import { Billboard, Category } from "@prisma/client";
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
import { useRouter, useParams } from "next/navigation";
import { useOrigin } from "@/app/components/hooks/use-origin";
import { Modal } from "@/app/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  billboardId: z.string().min(1, "Billboard selection is required"), // Updated to validate as a non-empty string
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, billboards }) => {
  const router = useRouter();
  const { storeId, billboardId } = useParams() || {};
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const origin = useOrigin();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      billboardId: initialData?.billboardId || "",
    },
  });

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData
    ? "Edit the details of your category"
    : "Add a new category";
  const toastMessage = initialData
    ? "Category updated successfully"
    : "Category created successfully";
  const actionLabel = initialData ? "Save Changes" : "Create Category";

  const onDelete = async () => {
    try {
      setLoading(true);
      if (storeId && billboardId) {
        await axios.delete(`/api/${storeId}/categories/${billboardId}`);
        toast.success("Category deleted successfully");
        router.push(`/${storeId}/categories`);
      }
    } catch (error) {
      toast.error("Error deleting category");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData && storeId && billboardId) {
        await axios.patch(`/api/${storeId}/categories/${billboardId}`, data);
      } else if (storeId) {
        await axios.post(`/api/${storeId}/categories`, data);
      }
      toast.success(toastMessage);
      router.push(`/${storeId}/categories`);
    } catch (error) {
      toast.error("Error saving category");
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
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-60">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Category Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Enter category name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billboardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Billboard</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a billboard"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map((billboard) => (
                      <SelectItem key={billboard.id} value={billboard.id}>
                        {billboard.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {actionLabel}
          </Button>
        </form>
      </Form>

      <Modal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this category? This action cannot be undone."
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
