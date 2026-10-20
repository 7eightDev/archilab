'use client'

import { useActionState, useEffect, useRef } from 'react'
import {
  type ContactFormState,
  type ContactFormValues,
  initialContactFormState,
} from '@/app/_actions/contact-form-state'
import { postContactRequest } from '@/app/_actions/post-contact-request'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Label } from '@/app/_components/ui/label'
import { Textarea } from '@/app/_components/ui/textarea'

export type ContactAction = (state: ContactFormState, formData: FormData) => Promise<ContactFormState>

const controlClass =
  'rounded-sm border-slate/60 bg-cream px-4 text-base text-navy placeholder:text-slate md:text-base focus-visible:border-teal-ink focus-visible:ring-teal/30 aria-invalid:border-error aria-invalid:ring-error/15'

interface FieldProps {
  name: keyof ContactFormValues
  label: string
  errors?: string[]
  children: (props: {
    id: string
    name: string
    'aria-invalid'?: true
    'aria-describedby'?: string
  }) => React.ReactNode
}

function Field({ name, label, errors, children }: FieldProps) {
  const id = `contact-${name}`
  const errorId = `${id}-error`
  const invalid = errors !== undefined && errors.length > 0

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-terracotta-ink">
        {label}
      </Label>
      {children({
        id,
        name,
        'aria-invalid': invalid ? true : undefined,
        'aria-describedby': invalid ? errorId : undefined,
      })}
      {invalid && (
        <p id={errorId} className="text-sm text-error">
          {errors.join(' ')}
        </p>
      )}
    </div>
  )
}

export function ContactForm({ action = postContactRequest }: { action?: ContactAction }) {
  const [state, formAction, pending] = useActionState(action, initialContactFormState)
  const { fieldErrors, formErrors, values } = state
  const formRef = useRef<HTMLFormElement>(null)

  // After a rejected submission, take keyboard and screen-reader users straight to the first problem.
  useEffect(() => {
    if (state.status !== 'error') return
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [state])

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Nome" errors={fieldErrors.name}>
          {(props) => (
            <Input {...props} type="text" required autoComplete="name" defaultValue={values.name} className={`h-12 ${controlClass}`} />
          )}
        </Field>
        <Field name="email" label="Email" errors={fieldErrors.email}>
          {(props) => (
            <Input {...props} type="email" required autoComplete="email" defaultValue={values.email} className={`h-12 ${controlClass}`} />
          )}
        </Field>
      </div>
      <Field name="message" label="Il tuo messaggio" errors={fieldErrors.message}>
        {(props) => (
          <Textarea
            {...props}
            required
            rows={6}
            defaultValue={values.message}
            placeholder="Che tipo di intervento, dove, con quali tempi"
            className={`min-h-40 py-4 ${controlClass}`}
          />
        )}
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex min-h-11 cursor-pointer items-start gap-4 py-2 text-sm leading-relaxed text-navy">
          <input
            type="checkbox"
            name="privacyConsent"
            required
            aria-invalid={fieldErrors.privacyConsent ? true : undefined}
            aria-describedby={fieldErrors.privacyConsent ? 'contact-privacy-error' : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-teal-ink"
          />
          Acconsento al trattamento dei miei dati per essere ricontattato.
        </label>
        {fieldErrors.privacyConsent && (
          <p id="contact-privacy-error" className="text-sm text-error">
            {fieldErrors.privacyConsent.join(' ')}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start gap-4">
        <Button type="submit" disabled={pending} className="min-w-32">
          {pending ? 'Invio in corso…' : 'Invia'}
        </Button>
        {/* Always mounted: screen readers only announce changes to a live region that already exists. */}
        <p role="status" className="text-base text-navy empty:hidden">
          {state.status === 'success' &&
            'Messaggio ricevuto, grazie. Ti rispondo all’indirizzo email che hai indicato.'}
        </p>
        {formErrors.length > 0 && (
          <p role="alert" className="text-base text-error">
            {formErrors.join(' ')}
          </p>
        )}
      </div>
    </form>
  )
}
