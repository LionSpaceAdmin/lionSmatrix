"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useState, DragEvent } from 'react';

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  details: z.string().min(20, { message: "Please provide at least 20 characters of detail." }),
  consent: z.boolean().refine(val => val === true, { message: "You must consent to continue." }),
});

export function ReportForm() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      details: "",
      consent: false,
    },
  });

  const handleFiles = (newFiles: FileList | null) => {
    if (newFiles) {
      setFiles(Array.from(newFiles));
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const ticketId = `TICKET-${Date.now()}`;
    console.log("Report submitted (mock):", { ...values, files: files.map(f => f.name) });
    toast({
      title: "Report Submitted",
      description: `Your report has been received. Your ticket ID is ${ticketId}.`,
    });
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return <div className="text-center"><h3 className="text-2xl font-bold">Thank You!</h3><p className="text-muted-foreground">Your report has been received.</p></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="url" render={({ field }) => (
          <FormItem>
            <FormLabel>URL of Content (Optional)</FormLabel>
            <FormControl><Input placeholder="https://example.com/article" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          className={`relative p-8 border-2 border-dashed rounded-lg text-center transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}
        >
          <input type="file" id="file-drop" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <label htmlFor="file-drop" className="cursor-pointer">
            <p>Drop files here, or click to select</p>
            {files.length > 0 && <p className="text-sm text-muted-foreground mt-2">{files.length} file(s) selected: {files.map(f => f.name).join(', ')}</p>}
          </label>
        </div>

        <FormField control={form.control} name="details" render={({ field }) => (
          <FormItem>
            <FormLabel>Details</FormLabel>
            <FormControl><Textarea placeholder="Provide details about the content, why you believe it's disinformation, and any other relevant context." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="consent" render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>I consent to having this submission, including any uploaded files, analyzed by Lions of Zion.</FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )} />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </Form>
  );
}
