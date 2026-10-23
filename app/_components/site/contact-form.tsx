'use client'

import { ArrowRightIcon } from 'lucide-react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { type ContactFormState, type ContactFormValues, initialContactFormState } from '@/app/_actions/contact-form-state'
import { submitContactForm } from '@/app/_actions/submit-contact-form'
import type { ContactRequestFieldErrors } from '@/app/_application/use-cases/submit-contact-request'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Label } from '@/app/_components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/_components/ui/select'
import { Switch } from '@/app/_components/ui/switch'
import { Textarea } from '@/app/_components/ui/textarea'
import { ContactRequestSchema, interventionTypeLabels, interventionTypes } from '@/app/_domain/entities/contact-request'
import { studio } from './content'
import { textLinkClass } from './link-styles'

export type ContactAction = (state: ContactFormState, formData: FormData) => Promise<ContactFormState>

type FieldName = keyof ContactFormValues

const controlClass =
  'rounded-none border-input bg-background px-3.5 text-[17px] text-foreground md:text-[17px] placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--ottone)] aria-invalid:border-2 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:ring-0'

/** Same rules as the server: the domain schema decides what is valid and what the messages say. */
function validate(formData: FormData): ContactRequestFieldErrors {
  const phone = formData.get('phone')
  const result = ContactRequestSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: typeof phone === 'string' && phone.trim() ? phone : undefined,
    interventionType: formData.get('interventionType') || undefined,
    message: formData.get('message'),
    privacyConsent: formData.get('privacyConsent') === 'on',
  })
  return result.success ? {} : z.flattenError(result.error).fieldErrors
}

function errorSummary(count: number): string {
  return count === 1 ? 'Controlla il campo evidenziato.' : `Controlla i ${count} campi evidenziati.`
}

/** Pre-fills the visitor's mail app with what they typed, so nothing has to be rewritten. */
function mailtoHref(email: string, values: ContactFormValues): string {
  const body = [values.message, values.name].filter(Boolean).join('\n\n')
  return `mailto:${email}?subject=${encodeURIComponent('Richiesta dal sito Archilab')}&body=${encodeURIComponent(body)}`
}

interface FieldProps {
  name: FieldName
  label: string
  errors?: string[]
  className?: string
  children: (props: { id: string; name: string; 'aria-invalid'?: true; 'aria-describedby'?: string }) => React.ReactNode
}

function Field({ name, label, errors, className, children }: FieldProps) {
  const id = `contact-${name}`
  const errorId = `${id}-error`
  const invalid = errors !== undefined && errors.length > 0

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <Label htmlFor={id} className="text-sm leading-normal font-medium">
        {label}
      </Label>
      {children({ id, name, 'aria-invalid': invalid ? true : undefined, 'aria-describedby': invalid ? errorId : undefined })}
      {/* Space reserved so the grid does not jump when an error appears. */}
      <p id={errorId} className="min-h-4 text-[13px] text-destructive">
        {invalid && errors.join(' ')}
      </p>
    </div>
  )
}

function Sent({ name, onReset }: { name: string; onReset: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => ref.current?.focus(), [])

  return (
    <div ref={ref} role="status" tabIndex={-1} className="flex flex-col gap-3 border border-input p-6 outline-none sm:p-10">
      <p className="font-heading text-[26px] leading-[1.2] tracking-[.04em]">Grazie {name.trim()}, ho ricevuto il tuo messaggio.</p>
      <p className="text-base leading-[1.6] text-muted-foreground">
        Ti rispondo appena posso.
      </p>
      <button
        type="button"
        onClick={onReset}
        className={`${textLinkClass} min-h-11 self-start text-base`}
      >
        Scrivi un altro messaggio
      </button>
    </div>
  )
}

function Form({ action, onReset }: { action: ContactAction; onReset: () => void }) {
  const [state, formAction, pending] = useActionState(action, initialContactFormState)
  const [errors, setErrors] = useState<ContactRequestFieldErrors>({})
  const [seenState, setSeenState] = useState(state)
  const formRef = useRef<HTMLFormElement>(null)

  // A new reply from the server replaces whatever the client-side check found.
  if (state !== seenState) {
    setSeenState(state)
    setErrors(state.fieldErrors)
  }

  // After a rejected submission, take keyboard and screen-reader users straight to the first problem.
  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [errors])

  if (state.status === 'success') return <Sent name={state.values.name} onReset={onReset} />

  const { values, formErrors } = state
  const errorCount = Object.values(errors).filter((messages) => messages && messages.length > 0).length

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      onSubmit={(event) => {
        const clientErrors = validate(new FormData(event.currentTarget))
        setErrors(clientErrors)
        if (Object.keys(clientErrors).length > 0) event.preventDefault()
      }}
      className="grid min-w-0 gap-5 sm:grid-cols-2"
    >
      <p aria-live="assertive" className="text-[15px] text-destructive empty:hidden sm:col-span-2">
        {errorCount > 0 && errorSummary(errorCount)}
      </p>

      <Field name="name" label="Nome *" errors={errors.name}>
        {(props) => <Input {...props} type="text" required autoComplete="name" maxLength={100} defaultValue={values.name} className={`h-13 ${controlClass}`} />}
      </Field>
      <Field name="email" label="Email *" errors={errors.email}>
        {(props) => <Input {...props} type="email" required autoComplete="email" defaultValue={values.email} className={`h-13 ${controlClass}`} />}
      </Field>
      <Field name="phone" label="Telefono (facoltativo)" errors={errors.phone}>
        {(props) => <Input {...props} type="tel" autoComplete="tel" defaultValue={values.phone} className={`h-13 ${controlClass}`} />}
      </Field>
      <Field name="interventionType" label="Tipo di intervento" errors={errors.interventionType}>
        {({ id, name, ...props }) => (
          <Select id={id} name={name} items={interventionTypeLabels} defaultValue={values.interventionType}>
            <SelectTrigger
              {...props}
              className={`h-13 w-full pr-4 data-[size=default]:h-13 [&>svg]:size-5 [&>svg]:text-foreground ${controlClass}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              className="border border-input bg-background p-0 shadow-none ring-0"
            >
              {interventionTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="rounded-none px-3.5 py-2.5 text-[17px] text-foreground"
                >
                  {interventionTypeLabels[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>
      <Field name="message" label="Raccontami l’idea *" errors={errors.message} className="sm:col-span-2">
        {(props) => (
          <Textarea
            {...props}
            required
            rows={5}
            defaultValue={values.message}
            placeholder="Es. vorrei ristrutturare il bagno e capire se serve una pratica"
            className={`min-h-36 py-3.5 leading-normal ${controlClass} placeholder:text-[15px] placeholder:text-muted-foreground/60`}
          />
        )}
      </Field>

      {/* Pulled up so the consent reads as part of the message, not a separate row. */}
      <div className="-mt-3 flex flex-col gap-2 sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-normal text-muted-foreground">
          <Switch
            name="privacyConsent"
            required
            defaultChecked={state.consentGiven}
            aria-invalid={errors.privacyConsent ? true : undefined}
            aria-describedby={errors.privacyConsent ? 'contact-privacy-error' : undefined}
            className="mt-px cursor-pointer data-checked:bg-ottone focus-visible:ring-0 focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_3px_var(--ottone)]"
          />
          {studio.privacyUrl ? (
            <span>
              Ho letto l’
              <a href={studio.privacyUrl} className={textLinkClass}>
                informativa privacy
              </a>{' '}
              e acconsento al trattamento dei dati per essere ricontattato. *
            </span>
          ) : (
            <span>Acconsento al trattamento dei miei dati per essere ricontattato. *</span>
          )}
        </label>
        <p id="contact-privacy-error" className="min-h-4 pl-11 text-[13px] text-destructive">
          {errors.privacyConsent?.join(' ')}
        </p>
      </div>

      {formErrors.length > 0 && (
        <div role="alert" className="flex flex-col gap-2 sm:col-span-2">
          <p className="text-[15px] text-destructive">{formErrors.join(' ')}</p>
          {state.fallbackEmail && (
            <a href={mailtoHref(state.fallbackEmail, values)} className={`${textLinkClass} text-[15px]`}>
              Invialo per email a {state.fallbackEmail}: il testo è già pronto
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-5 sm:col-span-2">
        <span className="text-[13px] text-muted-foreground">* campi obbligatori</span>
        <Button
          type="submit"
          size="cta"
          disabled={pending}
          className="focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--ottone)] max-sm:w-full"
        >
          {pending ? 'Invio in corso…' : <>Invia il messaggio <ArrowRightIcon aria-hidden /></>}
        </Button>
      </div>
    </form>
  )
}

/** Contact form: checked in the browser with the domain schema, then submitted to the Server Action. */
export function ContactForm({ action = submitContactForm }: { action?: ContactAction }) {
  // Remounting the form is the simplest way to start over after a message has been sent.
  const [round, setRound] = useState(0)
  return <Form key={round} action={action} onReset={() => setRound((current) => current + 1)} />
}
