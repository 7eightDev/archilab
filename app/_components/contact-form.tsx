'use client'

import { useActionState } from 'react'
import {
  type ContactFormState,
  type ContactFormValues,
  initialContactFormState,
} from '@/app/_actions/contact-form-state'
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

export function ContactForm({ action }: { action: ContactAction }) {
  const [state, formAction, pending] = useActionState(action, initialContactFormState)
  const { fieldErrors, formErrors, values } = state

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Nome" errors={fieldErrors.name}>
          {(props) => (
            <Input {...props} type="text" autoComplete="name" defaultValue={values.name} className={`h-12 ${controlClass}`} />
          )}
        </Field>
        <Field name="email" label="Email" errors={fieldErrors.email}>
          {(props) => (
            <Input {...props} type="email" autoComplete="email" defaultValue={values.email} className={`h-12 ${controlClass}`} />
          )}
        </Field>
      </div>
      <Field name="message" label="Il tuo messaggio" errors={fieldErrors.message}>
        {(props) => (
          <Textarea
            {...props}
            rows={6}
            defaultValue={values.message}
            placeholder="Che tipo di intervento, dove, con quali tempi"
            className={`min-h-40 py-4 ${controlClass}`}
          />
        )}
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-4 text-sm leading-relaxed text-navy">
          <input
            type="checkbox"
            name="privacyConsent"
            aria-invalid={fieldErrors.privacyConsent ? true : undefined}
            aria-describedby={fieldErrors.privacyConsent ? 'contact-privacy-error' : undefined}
            className="mt-1 size-4 shrink-0 accent-teal-ink"
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
        {state.status === 'success' && (
          <p role="status" className="text-base text-navy">
            Messaggio ricevuto, grazie. Ti rispondo all&apos;indirizzo email che hai indicato.
          </p>
        )}
        {formErrors.length > 0 && (
          <p role="alert" className="text-base text-error">
            {formErrors.join(' ')}
          </p>
        )}
      </div>
    </form>
  )
}
