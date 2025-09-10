'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Example Server Action for form submission
const submitFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function submitContactForm(formData: FormData) {
  try {
    const validatedFields = submitFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    })

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name, email, message } = validatedFields.data

    // Simulate processing (replace with actual logic)
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Contact form submitted:', { name, email, message })

    // Revalidate the contact page cache
    revalidatePath('/contact')
    
    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      errors: {
        general: ['Failed to submit form. Please try again.']
      }
    }
  }
}

// Example Server Action for data fetching with caching
export async function getIntelligenceData() {
  try {
    // Simulate data fetching (replace with actual API calls)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const data = {
      threats: Math.floor(Math.random() * 100),
      incidents: Math.floor(Math.random() * 50),
      lastUpdated: new Date().toISOString(),
    }

    return data
  } catch (error) {
    console.error('Intelligence data error:', error)
    throw new Error('Failed to fetch intelligence data')
  }
}

// Example Server Action with ISR (Incremental Static Regeneration)
export async function refreshIntelligenceData() {
  try {
    // Revalidate specific data
    revalidateTag('intelligence-data')
    
    return { success: true }
  } catch (error) {
    console.error('Refresh error:', error)
    return { success: false, error: 'Failed to refresh data' }
  }
}

// Example Server Action for navigation
export async function navigateToSecureSection(userId: string) {
  // Perform authentication/authorization checks
  if (!userId) {
    redirect('/auth/login')
  }

  // Redirect to secure section
  redirect('/platform/secure')
}