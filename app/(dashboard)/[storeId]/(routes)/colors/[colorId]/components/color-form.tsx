// "use client";

// import { Button } from "@/app/components/ui/button";
// import { Heading } from "@/app/components/ui/heading";
// import { Separator } from "@/app/components/ui/separator";
// import { Color } from "@prisma/client";
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
// import { Modal } from "@/app/components/ui/modal"; // Add a Modal component to show confirmation.

// interface ColorFormProps {
//   initialData: Color | null;
// }

// const formSchema = z.object({
//   name: z.string().min(1, "Color name is required"),
//   value: z.string().min(4, "Color value is required").regex(/^#/, {
//     message: 'String must be a valid hex code'
//   }),
// });

// type SizeFormValues = z.infer<typeof formSchema>;

// export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
//   const router = useRouter();
//   const { storeId, colorId } = useParams<{ storeId: string; colorId: string }>() || {};
//   const [loading, setLoading] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const origin = useOrigin();

//   const form = useForm<SizeFormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: initialData?.name || "",
//       value: initialData?.value || "",
//     },
//   });

//   const title = initialData ? "Edit Color" : "Create Color";
//   const description = initialData
//     ? "Edit the details of your color"
//     : "Add a new color";
//   const toastMessage = initialData
//     ? "color updated successfully"
//     : "color created successfully";
//   const actionLabel = initialData ? "Save Changes" : "Create color";

//   const onDelete = async () => {
//     try {
//       setLoading(true);
//       if (storeId && colorId) {
//         await axios.delete(`/api/${storeId}/colors/${colorId}`);
//         toast.success("Color deleted successfully");
//         router.push(`/${storeId}/colors`); // Redirect after deletion.
//       }
//     } catch (error) {
//       toast.error("Error deleting  color");
//     } finally {
//       setLoading(false);
//       setDeleteModalOpen(false);
//     }
//   };

//   const onSubmit = async (data: SizeFormValues) => {
//     try {
//       setLoading(true);
  
//       if (initialData) {
//         // Updating an existing color
//         if (storeId && colorId) {
//           await axios.patch(`api/${storeId}/colors/${colorId}`, data);
//           toast.success("Color updated successfully");
//         } else {
//           toast.error("Missing store ID or color ID");
//           return;
//         }
//       } else {
//         // Creating a new color
//         if (storeId) {
//           await axios.post(`/api/${storeId}/colors`, data);
//           toast.success("Color created successfully");
//         } else {
//           toast.error("Missing store ID");
//           return;
//         }
//       }
  
//       // Redirect to the colors page after successful update
//       router.push(`/${storeId}/colors`);
//     } catch (error: any) {
//       console.error("Error saving color:", error.response?.data || error.message);
//       toast.error("Error saving color. Please check the input and try again.");
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
//             <Trash className="h-4 w-4 " />
//           </Button>
//         )}
//       </div>
//       <Separator />
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-80">
//           <div className="grid grid-cols-1 gap-8">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm">Color Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={loading}
//                       placeholder="Enter Color name"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="value"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm">Color Value</FormLabel>
//                   <FormControl>
//                     <div className="flex items-center gap-x-4">
//                     <Input
//                       disabled={loading}
//                       placeholder="Enter Color value"
//                       {...field}
//                     />
//                     <div className="border p-4 rounded-full"
//                     style={{backgroundColor:field.value}}/>
//                     </div>
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
//         setIsOpen={() => setDeleteModalOpen(false)} // Use the correct onClose prop
//         title="Confirm Deletion"
//         description="Are you sure you want to delete this color? This action cannot be undone."
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

"use client";

import { Button } from "@/app/components/ui/button";
import { Heading } from "@/app/components/ui/heading";
import { Separator } from "@/app/components/ui/separator";
import { Color } from "@prisma/client";
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
import { Modal } from "@/app/components/ui/modal";

interface ColorFormProps {
  initialData: Color | null;
}

const formSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  value: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, { message: "Invalid hex color code" }),
});

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string; colorId: string }>();
  const { storeId, colorId } = params || {};
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      value: initialData?.value || "",
    },
  });

  const title = initialData ? "Edit Color" : "Create Color";
  const description = initialData
    ? "Edit the details of your color"
    : "Add a new color";
  const actionLabel = initialData ? "Save Changes" : "Create Color";

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      console.log("Submitting data:", data);
  
      if (initialData) {
        // Updating an existing color
        if (storeId && colorId) {
          console.log(`Updating color at /api/${storeId}/colors/${colorId}`);
          await axios.patch(`/api/${storeId}/colors/${colorId}`, data);
          toast.success("Color updated successfully");
        } else {
          toast.error("Missing store ID or color ID");
          return;
        }
      } else {
        // Creating a new color
        if (storeId) {
          console.log(`Creating color at /api/${storeId}/colors`);
          await axios.post(`/api/${storeId}/colors`, data);
          toast.success("Color created successfully");
        } else {
          toast.error("Missing store ID");
          return;
        }
      }
      router.push(`/${storeId}/colors`);
    } catch (error: any) {
      console.error("Error saving color:", error.response?.data || error.message);
      toast.error("Error saving color. Please check the input and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const onDelete = async () => {
    setLoading(true);
    try {
      if (storeId && colorId) {
        await axios.delete(`/api/${storeId}/colors/${colorId}`);
        toast.success("Color deleted successfully");
        router.push(`/${storeId}/colors`);
      }
    } catch (error) {
      toast.error("Error deleting color. Please try again.");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-80">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Color Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Enter color name" {...field} />
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
                <FormLabel className="text-sm">Color Value</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-x-4">
                    <Input disabled={loading} placeholder="#000000" {...field} />
                    <div
                      className="border p-4 rounded-full"
                      style={{ backgroundColor: field.value }}
                    />
                  </div>
                </FormControl>
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
        setIsOpen={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this color? This action cannot be undone."
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
