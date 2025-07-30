import React, { useState } from "react";
import styles from "./Form.module.css";

interface Field {
  name: string;
  label: string;
  type: "email" | "text" | "date" | "url" | "password";
  placeholder?: string;
}

interface DynamicFormProps {
  title: string;
  fields: readonly Field[];
  buttonText: string;
  onSubmit: (formData: Record<string, string>) => void;
  footerLink?: {
    text: string;
    linkText: string;
    href: string;
  };
}

export function SignUpForm({
  title,
  fields,
  buttonText,
  onSubmit,
  footerLink,
}: DynamicFormProps) {
  const initialState = fields.reduce(
    (acc, field) => {
      acc[field.name] = "";
      return acc;
    },
    {} as Record<string, string>,
  );

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className={styles.formGroup}>
            <label htmlFor={field.name} className={styles.label}>
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder || ""}
              className={styles.input}
              required
            />
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>
          {buttonText}
        </button>
      </form>

      {footerLink && (
        <p className={styles.footerText}>
          {footerLink.text} <a href={footerLink.href}>{footerLink.linkText}</a>
        </p>
      )}
    </div>
  );
}
