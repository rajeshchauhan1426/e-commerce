"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Modal } from "./ui/modal";

interface Store {
  id: string;
  name: string;
}

interface StoreSwitcherProps {}

const formSchema = z.object({
  name: z.string().min(1, { message: "Store name is required" }),
});

const StoreSwitcher: React.FC<StoreSwitcherProps> = () => {
  const params = useParams();
  const router = useRouter();

  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Fetch stores from `route.ts`
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("/api/stores"); // Make sure this aligns with your route.ts API endpoint
        router.refresh()
        const userStores: Store[] = response.data;

        setStores(userStores);

        // If params contain `storeId`, set it as the current store
        if (params?.storeId) {
          const matchedStore = userStores.find((store) => store.id === params.storeId);
          if (matchedStore) {
            setCurrentStore(matchedStore);
          }
        }
      } catch (error) {
        
      }
    };

    fetchStores();
  }, [params?.storeId]);

  const handleStoreSelect = (store: Store) => {
    setOpen(false);
    setCurrentStore(store);
    router.push(`/${store.id}`);
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // Check the values being sent to ensure `name` exists.
      console.log("Form Values:", values);

      const response = await axios.post("/api/stores", values);
      const newStore: Store = response.data;

      toast.success("Store created successfully");

      // Add the new store to the list
      setStores((prevStores) => [...prevStores, newStore]);

      // Redirect to the newly created store
      router.push(`/${newStore.id}`);
      setIsModalOpen(false);
    } catch (error) {
      // Log the error message for debugging
      console.error("Error creating store:", error);

      toast.error("Failed to create the store. Please try again.");
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.reset();
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a store"
            className={cn("w-[200px] justify-between")}
          >
            <StoreIcon className="mr-2 h-4 w-4" />
            {currentStore ? currentStore.name : "Select a store"}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search store ..." />
              <CommandEmpty>No store found</CommandEmpty>
              <CommandGroup heading="Stores">
                {stores.map((store) => (
                  <CommandItem
                    key={store.id}
                    onSelect={() => handleStoreSelect(store)}
                    className="text-sm"
                  >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {store.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentStore?.id === store.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setIsModalOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Store
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Modal
        title="Create Store"
        description="Add a new store to manage products and categories"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      >
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
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
                <Button disabled={loading} variant="outline" onClick={handleCancel}>
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

export default StoreSwitcher;
