"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  requestType: z.enum(["export", "delete"], { required_error: "You need to select a request type." }),
});

export function DsrForm() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newTicketId = `DSR-${Date.now()}`;
    setTicketId(newTicketId);
    console.log("DSR submitted (mock):", values);
    toast({
      title: "Request Submitted",
      description: `Your request has been received. Your ticket ID is ${newTicketId}.`,
    });
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold">Thank You!</h3>
        <p className="text-muted-foreground">Your request has been submitted. Your ticket ID is: <strong>{ticketId}</strong></p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Your Email</FormLabel>
            <FormControl><Input placeholder="your@email.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="requestType" render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Request Type</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="export" /></FormControl>
                  <FormLabel className="font-normal">Export my data</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="delete" /></FormControl>
                  <FormLabel className="font-normal">Delete my data</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </Form>
  );
}