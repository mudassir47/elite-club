"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2, Award, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
// Import Firebase here
import { getDatabase, ref, get } from "firebase/database";

export function VerifyCertificateComponent() {
  const router = useRouter();
  const [authCode, setAuthCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAuthCode = authCode.trim();
    if (trimmedAuthCode === "") return;

    setIsVerifying(true);
    setVerificationResult(null);

    // Check the authentication code in Firebase
    const db = getDatabase();
    const authCodeRef = ref(db, 'certificates/' + trimmedAuthCode); // Adjusted path

    try {
      const snapshot = await get(authCodeRef);
      console.log(snapshot.val()); // Log the data for debugging
      if (snapshot.exists()) {
        // Code exists in the database
        setVerificationResult("success");
        
        // Redirect to the certificate page with the auth code
        router.push(`/certificate/${trimmedAuthCode}`);
      } else {
        // Code does not exist in the database
        setVerificationResult("error");
      }
    } catch (error) {
      console.error("Error fetching authentication code: ", error);
      setVerificationResult("error");
    }

    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md overflow-hidden">
          <CardHeader className="bg-[#0075FF] text-white">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Verify Your Certificate</CardTitle>
            <CardDescription className="text-center text-blue-100">
              Enter your authentication code to verify the certificate authenticity.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="authCode" className="text-[#0075FF] font-semibold">Authentication Code</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="authCode"
                      placeholder="Enter your code here"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      className="pl-10 w-full border-[#0075FF] focus:ring-[#0075FF]"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#0075FF] hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying
                    </>
                  ) : (
                    "Verify Certificate"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <AnimatePresence>
              {verificationResult === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your certificate has been successfully verified.</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {verificationResult === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>The provided authentication code is invalid. Please try again.</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
