'use client'

import { useActionState } from 'react'
import {
  type ContactFormState,
  type ContactFormValues,
  initialContactFormState,
} from '@/app/_actions/contact-form-state'
import { Button } from '@/app/_components/ui/button'

type ContactAction = (state: ContactFormState, formData: FormData) => Promise<ContactFormState>

const inputClass =
  'w-full border-0 border-b border-line bg-transparent px-0 py-2 text-base text-ink placeholder:text-mist/70 focus:border-ink focus:outline-none focus-visible:ring-0 aria-invalid:border-rust'

interface FieldProps {
  name: keyof ContactFormValues
  label: string
  hint?: string
  errors?: string[]
  children: (props: {
    id: string
    name: string
    'aria-invalid'?: true
    'aria-describedby'?: string
  }) => React.ReactNode
}

function Field({ name, label, hint, errors, children }: FieldProps) {
  const id = `contact-${name}`
  const errorId = `${id}-error`
  const invalid = errors !== undefined && errors.length > 0

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-mist">
        {label}
        {hint && <span className="text-mist/70"> ({hint})</span>}
      </label>
      {children({
        id,
        name,
        'aria-invalid': invalid ? true : undefined,
        'aria-describedby': invalid ? errorId : undefined,
      })}
      {invalid && (
        <p id={errorId} className="text-sm text-rust">
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
    <form action={formAction} noValidate className="flex flex-col gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <Field name="name" label="Nome e cognome" errors={fieldErrors.name}>
          {(props) => (
            <input {...props} type="text" autoComplete="name" defaultValue={values.name} className={inputClass} />
          )}
        </Field>
        <Field name="email" label="Email" errors={fieldErrors.email}>
          {(props) => (
            <input {...props} type="email" autoComplete="email" defaultValue={values.email} className={inputClass} />
          )}
        </Field>
      </div>
      <Field name="phone" label="Telefono" hint="facoltativo" errors={fieldErrors.phone}>
        {(props) => (
          <input {...props} type="tel" autoComplete="tel" defaultValue={values.phone} className={inputClass} />
        )}
      </Field>
      <Field name="message" label="Di cosa hai bisogno?" errors={fieldErrors.message}>
        {(props) => (
          <textarea
            {...props}
            rows={5}
            defaultValue={values.message}
            placeholder="Tipo di intervento, luogo, tempi che hai in mente"
            className={`${inputClass} resize-y`}
          />
        )}
      </Field>

      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            name="privacyConsent"
            aria-invalid={fieldErrors.privacyConsent ? true : undefined}
            aria-describedby={fieldErrors.privacyConsent ? 'contact-privacy-error' : undefined}
            className="mt-0.5 size-4 accent-ink"
          />
          Acconsento al trattamento dei miei dati per essere ricontattato.
        </label>
        {fieldErrors.privacyConsent && (
          <p id="contact-privacy-error" className="text-sm text-rust">
            {fieldErrors.privacyConsent.join(' ')}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button
          type="submit"
          disabled={pending}
          className="h-11 rounded-none bg-ink px-6 text-base font-normal text-paper hover:bg-ink/85"
        >
          {pending ? 'Invio in corso…' : 'Invia la richiesta'}
        </Button>
        {state.status === 'success' && (
          <p role="status" className="text-sm text-ink">
            Richiesta inviata. Ti ricontatteremo all&apos;indirizzo che hai indicato.
          </p>
        )}
        {formErrors.length > 0 && (
          <p role="alert" className="text-sm text-rust">
            {formErrors.join(' ')}
          </p>
        )}
      </div>
    </form>
  )
}
