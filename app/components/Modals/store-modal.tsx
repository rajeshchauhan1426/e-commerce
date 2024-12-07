"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { Modal } from "../ui/modal";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router for navigation

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/stores", values);
      toast.success("Store created successfully");

      // After store creation, redirect to the store's page
      router.push(`/${response.data.id}`); // Assuming the response contains the created store's ID

      setIsOpen(false); // Close modal on success
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false); // Close modal
    form.reset(); // Clear form inputs
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create Store</Button>
      <Modal
        title="Create Store"
        description="Add a new Store to manage products and categories"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault(); // Prevent accidental Enter key submission
              }}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="E-commerce" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
                <Button
                  disabled={loading}
                  type="button" // Ensure this button is not treated as a submit button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Modal>
    </>
  );
};
