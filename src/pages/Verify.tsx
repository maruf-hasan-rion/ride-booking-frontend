import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dot } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { getApiErrorMessage } from "@/utils/apiResponse";

const FormSchema = z.object({
  pin: z.string().regex(/^\d{6}$/, {
    message: "OTP must be exactly 6 digits.",
  }),
});

const RESEND_TIMER_SECONDS = 30;

const getEmailFromLocationState = (state: unknown) => {
  if (typeof state === "string") {
    return state.trim();
  }

  if (
    typeof state === "object" &&
    state !== null &&
    "email" in state &&
    typeof state.email === "string"
  ) {
    return state.email.trim();
  }

  return "";
};

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = useMemo(() => {
    return (
      searchParams.get("email")?.trim() ||
      getEmailFromLocationState(location.state)
    );
  }, [location.state, searchParams]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [timer, setTimer] = useState(RESEND_TIMER_SECONDS);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Email not found for verification.");
      navigate("/login");
      return;
    }

    const toastId = toast.loading("Sending OTP");

    try {
      const res = await sendOtp({ email: email }).unwrap();

      if (res.success) {
        toast.success("OTP Sent", { id: toastId });
        setIsOtpSent(true);
        setTimer(RESEND_TIMER_SECONDS);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to send OTP. Please try again."));
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const toastId = toast.loading("Verifying OTP");
    const userInfo = {
      email,
      otp: data.pin,
    };

    try {
      const res = await verifyOtp(userInfo).unwrap();
      if (res.success) {
        toast.success("OTP Verified", { id: toastId });
        navigate("/login");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "OTP verification failed. Please try again."));
    }
  };

  useEffect(() => {
    if (!email) {
      toast.error("Verification email was not found. Please register again.");
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!email || !isOtpSent) {
      return;
    }

    const timerId = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [email, isOtpSent]);

  if (!email) {
    return null;
  }

  return (
    <div className="grid place-content-center h-screen">
      {isOtpSent ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Verify your email address</CardTitle>
            <CardDescription>
              Please enter the 6-digit code we sent to <br /> {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="otp-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-6"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <Dot />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        <Button
                          onClick={handleSendOtp}
                          type="button"
                          variant="link"
                          disabled={timer !== 0}
                          className={cn("p-0 m-0", {
                            "cursor-pointer": timer === 0,
                            "text-muted-foreground": timer !== 0,
                          })}
                        >
                          Resend OTP:
                        </Button>{" "}
                        {timer}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button form="otp-form" type="submit">
              Submit
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Verify your email address</CardTitle>
            <CardDescription>
              We will send you an OTP at <br /> {email}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSendOtp} className="w-[300px]">
              Confirm
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
