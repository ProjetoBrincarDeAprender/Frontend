import { Footer } from "../../components/Footer/Footer";
import { SignUpForm } from "../../components/Form/SignUpForm";
import { Header } from "../../components/Header/Header";

export default function Form() {
  return (
    <>
      <Header />
      <main>
        <SignUpForm
          title="Sign Up"
          fields={[
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "Enter your email",
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "Enter your password",
            },
          ]}
          buttonText="Create Account"
          onSubmit={(formData) => {
            console.log("Form submitted:", formData);
          }}
          footerLink={{
            text: "Already have an account?",
            linkText: "Log in",
            href: "/login",
          }}
        />
      </main>
      <Footer />
    </>
  );
}
