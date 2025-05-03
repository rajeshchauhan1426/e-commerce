"use client";

import { Button } from "@/app/components/ui/button";
import { Heading } from "@/app/components/ui/heading";
import { Separator } from "@/app/components/ui/separator";
import { Billboard, Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react"; // Import useCallback
import {
  Form,
  FormControl,
  FormDescription,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";


interface ProductFormProps {
  initialData: Product & {
    images: Image[]
  } | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];

}

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;
export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, colors,sizes }) => {
  const router = useRouter();

  const { storeId, productId } = useParams<{ storeId: string; productId: string}>() || {};
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const origin = useOrigin();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData  ? {
      ...initialData,
      price:parseFloat(String(initialData?.price))
    } : {
      name:  "",
      images:[],
      price: 0,
      categoryId: '',
      colorId: '',
      sizeId: '',
      isFeatured: false,
      isArchived: false
    },
  });

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData
    ? "Edit the details of your Product"
    : "Add a new Product";
  const toastMessage = initialData
    ? "Product updated successfully"
    : "Product created successfully";
  const actionLabel = initialData ? "Save Changes" : "Create Product";

  const onDelete = async () => {
    if (!storeId || !productId) {
      toast.error("Missing store or product ID");
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/products/${productId}`);
      toast.success("Product deleted successfully");
      router.push(`/${storeId}/products`);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!storeId) {
      toast.error("Missing store ID");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...data,
        images: data.images.map((img) => ({ url: img.url })),
      };

      if (productId) {
        // Update existing product
        await axios.patch(`/api/${storeId}/products/${productId}`, productData);
      } else {
        // Create new product
        await axios.post(`/api/${storeId}/products`, productData);
      }

      toast.success(toastMessage);
      router.refresh();
      router.push(`/${storeId}/products`);
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error?.response?.data || "Error saving product");
    } finally {
      setLoading(false);
    }
  };



  const handleRemoveImage = useCallback((index: number) => {
    form.setValue("images", form.getValues("images").filter((_, i) => i !== index));
  }, [form.setValue, form.getValues]);

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => {
                      const newImages = [...field.value, { url }];
                      field.onChange(newImages);
                    }}
                    onRemove={(url) => {
                      const updatedImages = field.value.filter((img) => img.url !== url);
                      field.onChange(updatedImages);
                    }}
                  />
                </FormControl>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {field.value.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md">
                      <img
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 shadow-md"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
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
        setIsOpen={setDeleteModalOpen}
        title="Delete product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      >
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={loading}
            variant="outline"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={onDelete}
          >
            Continue
          </Button>
        </div>
      </Modal>
    </>
  );
};