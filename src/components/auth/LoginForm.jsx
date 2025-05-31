// src/components/LoginForm.jsx
import { useContext } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../../api/axiosConfig";
import { loginFormSchema } from "../../utils/authFormSchema";
import { AuthContext } from "../../context/AuthProvider";

export function LoginForm() {
  const { login } = useContext(AuthContext); // Access login function
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const { data } = await authApi.post("/auth/login", values);
      if (data.success) {
        toast.success(data.message);
        login(); // Update auth state
        navigate("/"); // Redirect to TypingTestUI
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card
        className="bg-[#0E0F15] border-[#0E0F15]"
        style={{ boxShadow: "0 16px 32px rgba(0, 0, 0, 0.3)" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl text-white">Login</CardTitle>
          <CardDescription className="text-white">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white pb-2">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@email.com..."
                        className="bg-[#141723] py-5 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white pb-2">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="*********"
                        type="password"
                        className="bg-[#141723] py-5 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-[#141723] hover:bg-[#141723] border-none text-white hover:text-white py-5"
                  disabled={!form.formState.isDirty}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer bg-[#141723] hover:bg-[#141723] border-none text-white hover:text-white py-5"
                  type="button"
                >
                  Login with Google
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-white">
              Don't have an account?{" "}
              <Link to="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;