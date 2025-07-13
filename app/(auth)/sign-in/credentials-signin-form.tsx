"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

/*Usamos useActionState para la accion que va a hacer el formulario. A esto le vamos a pasar
las credenciales. Como estado incial va a ser false y sin mensaje*/
export default function CredentialsSignInForm() {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  /*Creamos el boton para ininciar sesion, usamos useFormStatus para ver que esta haciendo el formulario,
entonces desabilitamos el boton si este es igual a {pending}. Si esta pendiente mostrar signing In,
de lo contrario, mostrar Sign In   */
  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };

  /*le pasamos la action al formulario, el cual data va a actualizar {action}. Si data existe pero no tiene exito
  devolvemos el mensaje */
  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={SignInDefaultValues.email}
          ></Input>
        </div>
        <div>
          <Label htmlFor="email">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={SignInDefaultValues.password}
          ></Input>
        </div>
        <div>
          <SignInButton />
        </div>
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-smal text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" target="_self" className="link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
