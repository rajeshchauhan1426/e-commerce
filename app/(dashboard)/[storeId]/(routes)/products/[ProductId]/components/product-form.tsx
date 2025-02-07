"use client";

import { Button } from "@/app/components/ui/button";
import { Heading } from "@/app/components/ui/heading";
import { Separator } from "@/app/components/ui/separator";
import { Billboard, Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
  const { storeId, billboardId, productId } = useParams<{ storeId: string; billboardId: string; productId: string}>() || {};
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
    try {
      setLoading(true);
      if (storeId && billboardId && productId) {
        await axios.delete(`/api/${storeId}/products/${productId}`);
        toast.success("Product deleted successfully");
        router.push(`/${storeId}/products`); // Redirect after deletion.
      }
    } catch (error) {
      toast.error("Error deleting products");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      let response;
      if (initialData) {
        if (storeId && billboardId && productId ) {
          response = await axios.patch(`/api/${storeId}/products/${productId}`, data);
        }
      } else {
        if (storeId) {
          response = await axios.post(`/api/${storeId}/products`, data);
        }
      }
      toast.success(toastMessage);

      if (!initialData && response?.data?.id) {
        router.push(`/${storeId}/products`);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error("Error saving product");
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value ={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, {url}])}
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !==url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-8 w-60">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Name"
                      {...field}
                    />
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
                  <FormLabel className="text-sm">Price</FormLabel>
                  <FormControl>
                    <Input
                    type="number"
                      disabled={loading}
                      placeholder="9.999"
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
                <FormLabel className="text-sm">Category</FormLabel>
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
                        placeholder="Select a category"
                      />
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
            name="colorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Colors</FormLabel>
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
                        placeholder="Select a color"
                      />
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
            name="sizeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Size</FormLabel>
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
                        placeholder="Select a size"
                      />
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
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-300">
              
                <FormControl>
                  <Checkbox
                  checked={field.value}
                  
                  onCheckedChange={field.onChange}
                  />
                  
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                  <FormDescription> This product will appear on the home page</FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isArchived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-300">
              
                <FormControl>
                  <Checkbox
                  checked={field.value}
                  
                  onCheckedChange={field.onChange}
                  />
                  
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Archived</FormLabel>
                  <FormDescription> This produc will  not appear  in anywhere in the store </FormDescription>
                </div>
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


// "use client";

// import { Button } from "@/app/components/ui/button";
// import { Heading } from "@/app/components/ui/heading";
// import { Separator } from "@/app/components/ui/separator";
// import { Billboard, Image, Product } from "@prisma/client";
// import { Trash } from "lucide-react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/app/components/ui/form";
// import { Input } from "@/app/components/ui/input";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { useParams } from "next/navigation";
// import { useOrigin } from "@/app/components/hooks/use-origin";
// import ImageUpload from "@/app/components/ui/image-upload";
// import { Modal } from "@/app/components/ui/modal"; 

// interface ProductFormProps {
//   initialData: Product & {
//     images: Image[];
//   } | null;
// }

// const formSchema = z.object({
//   name: z.string().min(1),
//   images: z.array(z.object({ url: z.string() })).min(1, "At least one image is required"),
//   price: z.coerce.number().min(1),
//   categoryId: z.string().min(1),
//   colorId: z.string().min(1),
//   sizeId: z.string().min(1),
//   isFeatured: z.boolean().default(false).optional(),
//   isArchived: z.boolean().default(false).optional(),
// });

// type ProductFormValues = z.infer<typeof formSchema>;

// export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
//   const router = useRouter();
//   const { storeId, billboardId } = useParams<{ storeId: string; billboardId: string }>() || {};
//   const [loading, setLoading] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const origin = useOrigin();

//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: initialData
//       ? {
//           ...initialData,
//           price: parseFloat(String(initialData?.price)),
//         }
//       : {
//           name: "",
//           images: [],
//           price: 0,
//           categoryId: "",
//           colorId: "",
//           sizeId: "",
//           isFeatured: false,
//           isArchived: false,
//         },
//   });

//   const title = initialData ? "Edit Product" : "Create Product";
//   const description = initialData
//     ? "Edit the details of your Product"
//     : "Add a new Product";
//   const toastMessage = initialData
//     ? "Product updated successfully"
//     : "Product created successfully";
//   const actionLabel = initialData ? "Save Changes" : "Create Product";

//   const onDelete = async () => {
//     try {
//       setLoading(true);
//       if (storeId && billboardId) {
//         await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
//         toast.success("Product deleted successfully");
//         router.push(`/${storeId}/billboards`);
//       }
//     } catch (error) {
//       toast.error("Error deleting billboard");
//     } finally {
//       setLoading(false);
//       setDeleteModalOpen(false);
//     }
//   };

//   const onSubmit = async (data: ProductFormValues) => {
//     try {
//       setLoading(true);
//       let response;
//       if (initialData) {
//         if (storeId && billboardId) {
//           response = await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data);
//         }
//       } else {
//         if (storeId) {
//           response = await axios.post(`/api/${storeId}/billboards`, data);
//         }
//       }
//       toast.success(toastMessage);

//       if (!initialData && response?.data?.id) {
//         router.push(`/${storeId}/billboards`);
//       } else {
//         router.refresh();
//       }
//     } catch (error) {
//       toast.error("Error saving billboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading title={title} description={description} />
//         {initialData && (
//           <Button
//             variant="destructive"
//             onClick={() => setDeleteModalOpen(true)}
//             disabled={loading}
//           >
//             <Trash className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <Separator />
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
//           <FormField
//             control={form.control}
//             name="images"
//             render={({ field }) => {
//               const imageUrls = field.value?.map((img) => img.url) || [];
//               return (
//                 <FormItem>
//                   <FormLabel className="text-sm">Background image</FormLabel>
//                   <FormControl>
//                     <ImageUpload
//                       disabled={loading}
//                       value={imageUrls} // ✅ Ensure correct data structure
//                       onChange={(url) => field.onChange([...field.value, { url }])} // ✅ Fix `onChange`
//                       onRemove={(url) =>
//                         field.onChange(field.value.filter((item) => item.url !== url)) // ✅ Fix `onRemove`
//                       }
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               );
//             }}
//           />
//           <div className="grid grid-cols-1 gap-8">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm">Billboard Label</FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={loading}
//                       placeholder="Enter billboard label"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <Button disabled={loading} className="ml-auto" type="submit">
//             {actionLabel}
//           </Button>
//         </form>
//       </Form>

//       <Modal
//         isOpen={deleteModalOpen}
//         setIsOpen={() => setDeleteModalOpen(false)}
//         title="Confirm Deletion"
//         description="Are you sure you want to delete this billboard? This action cannot be undone."
//       >
//         <div className="flex justify-end gap-4">
//           <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
//             Cancel
//           </Button>
//           <Button variant="destructive" onClick={onDelete} disabled={loading}>
//             Delete
//           </Button>
//         </div>
//       </Modal>
//     </>
//   );
// };
